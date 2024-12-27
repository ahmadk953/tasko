import { clerkMiddleware } from '@clerk/nextjs/server';
import arcjet, { shield, detectBot } from './lib/arcjet';
import { createMiddleware } from '@arcjet/next';

const aj = arcjet
  .withRule(
    shield({
      mode: 'LIVE',
    })
  )
  .withRule(
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE'],
    })
  );

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

export default createMiddleware(aj, clerkMiddleware());
