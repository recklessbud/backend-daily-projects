import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis.config';
import { logger } from '../utils/logger';

/**
 * Cache middleware
 * @param {number} duration - The duration in seconds of the cache
 * @returns {function(Request, Response, NextFunction)} - The middleware function
 */
export const cacheMiddleware = (duration: number): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Generate a cache key based on the original URL
            const key = `cache:${req.originalUrl}`;
            // Check if the data is cached
            const cachedData = await redisClient.get(key);

            if (cachedData) {
                logger.info(`Cache hit for ${key}`);
                // Return the cached data
                res.json(JSON.parse(cachedData));
                return;
            }

            // Overwrite the original res.json method to cache the data
            const originalJson = res.json;
            res.json = function (data) {
                // Cache the data
                redisClient.setex(key, duration, JSON.stringify(data));
                logger.info(`Cache set for ${key}`);
                // Call the original res.json method with the cached data
                return  originalJson.call(this, data);
            };

            // Continue with the next middleware
            next();
        } catch (error) {
            logger.error('Cache middleware error:', error);
            // Continue with the next middleware
            next();
        }
    };
};
