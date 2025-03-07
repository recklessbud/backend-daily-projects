import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis.config';
import { logger } from '../utils/logger';

export const cacheMiddleware = (duration: number) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const key = `cache:${req.originalUrl}`;
            const cachedData = await redisClient.get(key);

            if (cachedData) {
                logger.info(`Cache hit for ${key}`);
                 res.json(JSON.parse(cachedData));
                 return
                 
            }

            const originalJson = res.json;
            res.json = function (data) {
                redisClient.setex(key, duration, JSON.stringify(data));
                logger.info(`Cache set for ${key}`);
            return  originalJson.call(this, data);
              
               
            };
            

            next();
        } catch (error) {
            logger.error('Cache middleware error:', error);
            next();
        }
    };
};