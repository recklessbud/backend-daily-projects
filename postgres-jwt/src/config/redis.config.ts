import {Redis} from "ioredis";

export const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379),
    // password: String(process.env.REDIS_PASSWORD),
    maxRetriesPerRequest: 3
});


redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

export default redisClient;