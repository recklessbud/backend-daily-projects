import Redis from "ioredis";
import { envVariables } from "./dotenv.config";

const {REDIS_HOST, REDIS_PORT}=envVariables

const redis = new Redis({
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
});

redis.on('error', (err) => console.log('Redis Client Error', err));
redis.on('connect', () => console.log('Redis Client Connected'));



export default redis