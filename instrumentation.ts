import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');

    const { registerInitialCache } = await import(
      '@neshca/cache-handler/instrumentation'
    );

    const CacheHandler = (await import('./cache-handler')).default;

    await registerInitialCache(CacheHandler);
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
