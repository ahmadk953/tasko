import { clerkMiddleware } from '@clerk/nextjs/server';
import arcjet, { shield } from './lib/arcjet';
import { createMiddleware } from '@arcjet/next';

const aj = arcjet.withRule(
  shield({
    mode: 'LIVE',
  })
);

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

export default createMiddleware(aj, clerkMiddleware());
