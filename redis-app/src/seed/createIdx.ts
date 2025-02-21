import { SchemaFieldTypes } from "redis";
import { initializeRedisClient } from "../utils/redisClient.ts";
import { log } from "console";
import { getKeyName, resIndexKey } from "../utils/keys.ts";


async function createIndex(){
   const client = await initializeRedisClient();
   try {
    await client.ft.dropIndex(resIndexKey)
    // console.log("jnwrng")
   } catch (error) {
    console.log(error, ": no existing index to delete")
   }

   await client.ft.create(resIndexKey, {
    id: {
        type: SchemaFieldTypes.TEXT,
        AS: "id"	
    }, 
    name: {
        type: SchemaFieldTypes.TEXT,
        AS: "name"
    }, 
    avgStars: {
        type: SchemaFieldTypes.NUMERIC,
        AS: "avgStars",
        SORTABLE: true
    },
}, 
{
        ON: "HASH", 
        PREFIX: getKeyName("restaurants"),
    }
 )
  
}


await createIndex();
process.exit()