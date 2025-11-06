import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import arcjet, { fixedWindow } from '@/lib/arcjet';

const aj = arcjet.withRule(
  fixedWindow({
    mode: 'LIVE',
    max: 10,
    window: '60s',
  })
);

/**
 * Stripe webhook handler
 * - Verifies signature using STRIPE_WEBHOOK_SECRET
 * - Handles `checkout.session.completed` and `invoice.payment_succeeded`
 * - Uses an upsert for org subscription to avoid duplicates
 * - Preserves existing business logic while fixing bugs and improving error handling
 */
export async function POST(req: Request) {
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests', reason: decision.reason }),
      { status: 429 }
    );
  }

  const rawBody = await req.text();
  const sig = (await headers()).get('Stripe-Signature');

  if (!sig) {
    console.error('Missing Stripe-Signature header');
    return new NextResponse(JSON.stringify({ error: 'Missing signature' }), {
      status: 400,
    });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return new NextResponse(
      JSON.stringify({ error: 'Server misconfiguration' }),
      { status: 500 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Failed to construct Stripe event:', err?.message ?? err);
    return new NextResponse(
      JSON.stringify({ error: 'Invalid webhook signature' }),
      {
        status: 400,
      }
    );
  }

  try {
    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const orgId = session?.metadata?.orgId;
      if (!orgId) {
        console.error('checkout.session.completed missing orgId in metadata', {
          sessionId: session.id,
        });
        return new NextResponse(JSON.stringify({ error: 'Missing orgId' }), {
          status: 400,
        });
      }

      const subscriptionId = session.subscription as string | undefined;
      if (!subscriptionId) {
        console.error('checkout.session.completed missing subscription id', {
          sessionId: session.id,
        });
        return new NextResponse(
          JSON.stringify({ error: 'Missing subscription id' }),
          { status: 400 }
        );
      }

      // Expand items.price to make sure price id is available
      const subscription = (await stripe.subscriptions.retrieve(
        subscriptionId,
        {
          expand: ['items.data.price'],
        }
      )) as any;

      const priceId = subscription.items?.data?.[0]?.price?.id ?? null;
      const currentPeriodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null;

      // Upsert by orgId (orgId is unique in schema) to avoid duplicate creations
      await db.orgSubscription.upsert({
        where: { orgId },
        create: {
          orgId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: (session.customer as string) ?? undefined,
          stripePriceId: priceId ?? undefined,
          stripeCurrentPeriodEnd: currentPeriodEnd ?? undefined,
        },
        update: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: (session.customer as string) ?? undefined,
          stripePriceId: priceId ?? undefined,
          stripeCurrentPeriodEnd: currentPeriodEnd ?? undefined,
        },
      });
    }

    // Handle invoice.payment_succeeded
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as any;
      const subscriptionId = invoice.subscription as string | null;
      if (!subscriptionId) {
        // nothing to update if there's no subscription id
        console.warn('invoice.payment_succeeded without subscription id', {
          invoiceId: invoice.id,
        });
        return NextResponse.json({ received: true });
      }

      const subscription = (await stripe.subscriptions.retrieve(
        subscriptionId,
        {
          expand: ['items.data.price'],
        }
      )) as any;

      const priceId = subscription.items?.data?.[0]?.price?.id ?? null;
      const currentPeriodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null;

      try {
        await db.orgSubscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: priceId ?? undefined,
            stripeCurrentPeriodEnd: currentPeriodEnd ?? undefined,
          },
        });
      } catch (prismaErr: any) {
        // If no matching record found, log and continue.
        console.warn('No orgSubscription found to update for subscription', {
          subscriptionId: subscription.id,
          error: prismaErr?.message ?? prismaErr,
        });
      }
    }
  } catch (err: any) {
    console.error('Error processing webhook event:', err?.message ?? err);
    return new NextResponse(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
    });
  }

  return NextResponse.json({ received: true });
}
