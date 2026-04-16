import Redis from 'ioredis';
import NodeCache from 'node-cache';

class CacheService {
  private redis: Redis | null = null;
  private fallback: NodeCache;
  private isRedisConnected: boolean = false;

  constructor() {
    this.fallback = new NodeCache({ stdTTL: 3600 }); // Default 1 hour TTL
    
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    try {
      this.redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
           if (times > 3) {
             console.warn('Redis connection failed. Falling back to in-memory cache.');
             return null; // Stop retrying
           }
           return Math.min(times * 50, 2000);
        }
      });

      this.redis.on('connect', () => {
        this.isRedisConnected = true;
        console.log('✅ Redis Connected successfully.');
      });

      this.redis.on('error', (err) => {
        this.isRedisConnected = false;
        // console.error('Redis error:', err.message);
      });
    } catch (e) {
      console.warn('Redis initialization skipped. Using in-memory fallback.');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.isRedisConnected && this.redis) {
      try {
        const data = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
      } catch {
        return this.fallback.get<T>(key) || null;
      }
    }
    return this.fallback.get<T>(key) || null;
  }

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    const stringValue = JSON.stringify(value);
    
    if (this.isRedisConnected && this.redis) {
      try {
        await this.redis.setex(key, ttlSeconds, stringValue);
        return;
      } catch {
        // Fallback
      }
    }
    this.fallback.set(key, value, ttlSeconds);
  }

  async del(key: string): Promise<void> {
    if (this.isRedisConnected && this.redis) {
      try {
        await this.redis.del(key);
      } catch {}
    }
    this.fallback.del(key);
  }
}

export const cacheService = new CacheService();
export default cacheService;
