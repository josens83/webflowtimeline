import Redis from 'ioredis';
import { log } from './logger';

/**
 * Redis 클라이언트 설정
 * - 캐싱
 * - 세션 스토어
 * - Rate limiting 스토어
 */

let redisClient: Redis | null = null;

/**
 * Redis 연결 초기화
 */
export function initRedis(): Redis | null {
  // Redis가 비활성화된 경우
  if (process.env.REDIS_ENABLED !== 'true') {
    log.info('Redis is disabled, using in-memory cache');
    return null;
  }

  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0'),

      // 재연결 설정
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },

      // 최대 재시도 횟수
      maxRetriesPerRequest: 3,

      // 연결 타임아웃
      connectTimeout: 10000,

      // 명령 타임아웃
      commandTimeout: 5000,

      // Lazy connect (서버 시작 시 바로 연결하지 않음)
      lazyConnect: false,
    });

    // 연결 성공
    redisClient.on('connect', () => {
      log.info('Redis connected successfully', {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || '6379',
      });
    });

    // 준비 완료
    redisClient.on('ready', () => {
      log.info('Redis ready to accept commands');
    });

    // 에러 처리
    redisClient.on('error', (err) => {
      log.error('Redis connection error', { error: err.message });
    });

    // 재연결
    redisClient.on('reconnecting', () => {
      log.warn('Redis reconnecting...');
    });

    // 연결 종료
    redisClient.on('close', () => {
      log.warn('Redis connection closed');
    });

    return redisClient;
  } catch (error) {
    log.error('Failed to initialize Redis', { error });
    return null;
  }
}

/**
 * Redis 클라이언트 가져오기
 */
export function getRedisClient(): Redis | null {
  return redisClient;
}

/**
 * Redis 연결 종료
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    log.info('Redis connection closed gracefully');
  }
}

/**
 * 캐시 헬퍼 함수
 */
export const cache = {
  /**
   * 캐시에서 값 가져오기
   */
  async get<T = any>(key: string): Promise<T | null> {
    if (!redisClient) return null;

    try {
      const value = await redisClient.get(key);
      if (!value) return null;

      return JSON.parse(value) as T;
    } catch (error) {
      log.error('Redis GET error', { key, error });
      return null;
    }
  },

  /**
   * 캐시에 값 저장
   */
  async set(key: string, value: any, ttl: number = 300): Promise<boolean> {
    if (!redisClient) return false;

    try {
      const serialized = JSON.stringify(value);
      await redisClient.setex(key, ttl, serialized);
      return true;
    } catch (error) {
      log.error('Redis SET error', { key, error });
      return false;
    }
  },

  /**
   * 캐시에서 값 삭제
   */
  async del(key: string): Promise<boolean> {
    if (!redisClient) return false;

    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      log.error('Redis DEL error', { key, error });
      return false;
    }
  },

  /**
   * 패턴으로 키 삭제
   */
  async delPattern(pattern: string): Promise<number> {
    if (!redisClient) return 0;

    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length === 0) return 0;

      await redisClient.del(...keys);
      return keys.length;
    } catch (error) {
      log.error('Redis DEL pattern error', { pattern, error });
      return 0;
    }
  },

  /**
   * 캐시 존재 여부 확인
   */
  async exists(key: string): Promise<boolean> {
    if (!redisClient) return false;

    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      log.error('Redis EXISTS error', { key, error });
      return false;
    }
  },

  /**
   * TTL 확인
   */
  async ttl(key: string): Promise<number> {
    if (!redisClient) return -2;

    try {
      return await redisClient.ttl(key);
    } catch (error) {
      log.error('Redis TTL error', { key, error });
      return -2;
    }
  },

  /**
   * 캐시 TTL 연장
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    if (!redisClient) return false;

    try {
      await redisClient.expire(key, ttl);
      return true;
    } catch (error) {
      log.error('Redis EXPIRE error', { key, error });
      return false;
    }
  },

  /**
   * Increment counter
   */
  async incr(key: string): Promise<number> {
    if (!redisClient) return 0;

    try {
      return await redisClient.incr(key);
    } catch (error) {
      log.error('Redis INCR error', { key, error });
      return 0;
    }
  },

  /**
   * Decrement counter
   */
  async decr(key: string): Promise<number> {
    if (!redisClient) return 0;

    try {
      return await redisClient.decr(key);
    } catch (error) {
      log.error('Redis DECR error', { key, error });
      return 0;
    }
  },

  /**
   * Hash 저장
   */
  async hset(key: string, field: string, value: any): Promise<boolean> {
    if (!redisClient) return false;

    try {
      const serialized = JSON.stringify(value);
      await redisClient.hset(key, field, serialized);
      return true;
    } catch (error) {
      log.error('Redis HSET error', { key, field, error });
      return false;
    }
  },

  /**
   * Hash 가져오기
   */
  async hget<T = any>(key: string, field: string): Promise<T | null> {
    if (!redisClient) return null;

    try {
      const value = await redisClient.hget(key, field);
      if (!value) return null;

      return JSON.parse(value) as T;
    } catch (error) {
      log.error('Redis HGET error', { key, field, error });
      return null;
    }
  },

  /**
   * Hash 전체 가져오기
   */
  async hgetall<T = any>(key: string): Promise<Record<string, T> | null> {
    if (!redisClient) return null;

    try {
      const hash = await redisClient.hgetall(key);
      if (!hash || Object.keys(hash).length === 0) return null;

      const result: Record<string, T> = {};
      for (const [field, value] of Object.entries(hash)) {
        result[field] = JSON.parse(value) as T;
      }

      return result;
    } catch (error) {
      log.error('Redis HGETALL error', { key, error });
      return null;
    }
  },
};

/**
 * 캐시 미들웨어 생성기
 */
export function cacheMiddleware(keyPrefix: string, ttl: number = 300) {
  return async (req: any, res: any, next: any) => {
    // GET 요청만 캐싱
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `${keyPrefix}:${req.originalUrl}`;

    try {
      const cachedData = await cache.get(cacheKey);

      if (cachedData) {
        log.debug('Cache HIT', { key: cacheKey });
        return res.json(cachedData);
      }

      log.debug('Cache MISS', { key: cacheKey });

      // 원래 res.json을 저장
      const originalJson = res.json.bind(res);

      // res.json 오버라이드
      res.json = function (data: any) {
        // 캐시에 저장 (fire and forget)
        cache.set(cacheKey, data, ttl).catch((err) => {
          log.error('Failed to cache response', { key: cacheKey, error: err });
        });

        // 원래 응답 전송
        return originalJson(data);
      };

      next();
    } catch (error) {
      log.error('Cache middleware error', { error });
      next();
    }
  };
}

export default redisClient;
