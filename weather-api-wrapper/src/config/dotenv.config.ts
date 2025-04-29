import dotenv from 'dotenv';

dotenv.config()

export const envVariables = {
    PORT: process.env.PORT,
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,
    WEATHER_API_BASE_URL: process.env.WEATHER_API_BASE_URL,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_HOST: process.env.REDIS_HOST,
    CACHE_TTL: process.env.CACHE_TTL
}

// console.log(envVariables.WEATHER_API_BASE_URL)