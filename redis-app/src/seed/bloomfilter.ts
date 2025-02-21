import { initializeRedisClient } from "../utils/redisClient.ts";
import { bloomFilter } from "../utils/keys.ts";
import { log } from "console";

async function seedBloomFilter() {
    const client = await initializeRedisClient();
    try {
        await Promise.all([
         client.del(bloomFilter), 
         client.bf.reserve(bloomFilter, 0.0001, 10000),
        ])
        log('bloom filter seeded')
        
    } catch (error) {
        log(error)
    }
}


await seedBloomFilter();
process.exit()