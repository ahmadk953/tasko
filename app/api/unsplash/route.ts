import arcjet, { fixedWindow } from '@/lib/arcjet';
import { unsplash } from '@/lib/unsplash';

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const aj = arcjet.withRule(
  fixedWindow({
    mode: 'LIVE',
    max: 10,
    window: '60s',
  })
);

export async function GET(req: Request) {
  try {
    const { orgId, userId } = await auth();
    if (!orgId || !userId)
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });

    const decision = await aj.protect(req);
    if (decision.isDenied())
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests', reason: decision.reason }),
        { status: 429 }
      );
    const result = await unsplash.photos.getRandom({
      collectionIds: ['317099'],
      count: 9,
    });

    if (result?.response) {
      const newImages = Array.isArray(result.response)
        ? result.response
        : [result.response];
      const response = new NextResponse(JSON.stringify(newImages), {
        status: 200,
      });
      return response;
    } else {
      return new NextResponse('Failed to get images', { status: 500 });
    }
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}
