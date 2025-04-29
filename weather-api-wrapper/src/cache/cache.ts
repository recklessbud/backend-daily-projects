import redis from "../config/redis.config";
import { getWeather } from "../api/weather.api";
import { envVariables } from "../config/dotenv.config";


export const cache = async(city: string): Promise<any> => {
    const weatherKey = `city: ${city.toLowerCase()}`
  try {
    const cachedData = await redis.get(weatherKey);
    if(cachedData){
        console.log(`cacheHit`)
        return JSON.parse(cachedData);
    }
    const data = await getWeather(city);
    await redis.set(weatherKey, JSON.stringify(data), "EX", Number(envVariables.CACHE_TTL));
    return data
  } catch (error) {
    console.error("Error caching data:", error);
    throw new Error("Error caching data");
    
  }
}