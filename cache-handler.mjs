import Redis from 'ioredis'

const redis = new Redis(`${process.env.REDIS_URL}`)

export default class CacheHandler {
  constructor(options) {
    this.options = options
  }

  async get(key) {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  }

  async set(key, data, ctx) {
    const cacheData = {
      value: data,
      lastModified: Date.now(),
      tags: ctx.tags,
    }
    await redis.set(key, JSON.stringify(cacheData))
  }

  async revalidateTag(tags) {
    tags = [tags].flat()
    const keys = await redis.keys('*')
    for (const key of keys) {
      const value = await redis.get(key)
      if (value) {
        const parsed = JSON.parse(value)
        if (parsed.tags.some(tag => tags.includes(tag))) {
          await redis.del(key)
        }
      }
    }
  }

  resetRequestCache() {
    // Implement request-specific cache reset if needed
  }
}