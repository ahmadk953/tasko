import { CacheHandler } from '@neshca/cache-handler';
import createLruHandler from '@neshca/cache-handler/local-lru';
import createRedisHandler from '@neshca/cache-handler/redis-stack';
import Redis from 'ioredis';

CacheHandler.onCreation(async () => {
  /** @type {import("@neshca/cache-handler").Handler | null} */
  let handler;

  let client;

  try {
    client = new Redis(`${process.env.REDIS_URL}`);

    client.on('error', (error) => {
      if (typeof process.env.NEXT_PRIVATE_DEBUG_CACHE !== 'undefined') {
        console.error('Redis client error:', error);
      }
    });
  } catch (error) {
    console.warn('Failed to create Redis client:', error);
  }

  if (client) {
    try {
      console.info('Connecting Redis client...');

      await client.connect();
      console.info('Redis client connected.');

      handler = createRedisHandler({
        client,
        timeoutMs: 1000,
      });
    } catch (error) {
      console.warn('Failed to connect Redis client:', error);

      console.warn('Disconnecting the Redis client...');
      client
        .disconnect()
        .then(() => {
          console.info('Redis client disconnected.');
        })
        .catch(() => {
          console.warn(
            'Failed to quit the Redis client after failing to connect.'
          );
        });

      handler = createLruHandler();
      console.warn(
        'Falling back to LRU handler because Redis client is not available.'
      );
    }
  }

  return {
    handlers: [handler],
  };
});

export default CacheHandler;
