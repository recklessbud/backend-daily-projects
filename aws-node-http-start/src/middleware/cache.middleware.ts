import { Request, Response, NextFunction } from 'express';
import getRedisClient  from '../config/redis.config';
import envVariables from '../config/env.config';

export const cacheMiddleware = (durationInSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Add timeout promise
    const timeout = (ms: number) => new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Redis operation timed out')), ms)
    );

    try {
      const redisClient = await getRedisClient;
      const { shortId } = req.params;

      if (!shortId) return next();

      const cacheKey = `shorturl:${shortId}`;

      // Race between Redis operation and timeout
      const cachedUrl = await Promise.race([
        redisClient.redisClient.get(cacheKey),
        timeout(5000) // 5 second timeout for Redis operations
      ]);

      if (cachedUrl) {
        console.log(`🔁 Cache hit for ${shortId} -> ${cachedUrl}`);
        return res.redirect(cachedUrl);
      }

      // Modified redirect interceptor with timeout handling
      const originalRedirect = res.redirect.bind(res);
      res.redirect = function (url: any) {
        Promise.race([
          redisClient.redisClient.setex(cacheKey, durationInSeconds, url),
          timeout(5000)
        ])
          .then(() => console.log(`✅ Cached redirect for ${shortId} -> ${url}`))
          .catch((err: any) => console.error(`❌ Failed to cache ${shortId}`, err));

        return originalRedirect(url);
      };

      next();
    } catch (err) {
      console.error('❌ Redis cache middleware error:', err);
      // Continue without cache on error
      next();
    }
  };
};
