import Redis from 'ioredis';

let redis;

if (!redis) {
  redis = new Redis(process.env.REDIS_URL);

  redis.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });
}

export default redis;
