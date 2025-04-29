import redis from "../config/redis.config";
import RedisStore from "rate-limit-redis";
import rateLimit from "express-rate-limit";

export const weatherRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 3,
    message: "Too many weather requests. Try again in a minute.",
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args: [any]) => redis.call(...args) as Promise<any>
    })
})







// export const weatherRateLimiter = rateLimit({
//     windowMs: 1 * 60 * 1000, // 1 minute
//     max: 5, // limit each IP to 5 requests per minute
//     message: "Too many weather requests. Try again in a minute.",
//     standardHeaders: true,
//     legacyHeaders: false,
//     store: new RedisStore({
//       sendCommand: (...args: string[]) => redisClient.call(...args),
//     }),
//   })