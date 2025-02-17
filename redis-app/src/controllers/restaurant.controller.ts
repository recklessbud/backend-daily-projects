import type { Request, Response, NextFunction } from "express";
// import * as errorHandler from '../middleware/errorHandler.middleware.ts'
// import { create } from "domain";
import * as validateSchema from '../utils/validation.utils.ts'
import { validate } from "../middleware/inputValidation.middleware.ts"; 
import { initializeRedisClient } from "../utils/redisClient.ts";
import { nanoid } from "nanoid";
import { restaurantKeyById } from "../utils/keys.ts";
import { successResponse, errorFunction } from "../utils/responses.ts";


export const createRestaurant = async(req: Request, res: Response, next: NextFunction): Promise<void>  => {
     const body = req.body as validateSchema.RestaurantSchema;
     try {
      const client = await initializeRedisClient();
      const id =  nanoid();
      const restaurantKey: string = restaurantKeyById(id);
      const hashData = { id, name: body.name, location: body.location, };
      const addData = await client.hSet(restaurantKey, hashData);
      console.log(`added ${addData}`)
      successResponse(res, hashData, "Success")
       return;
     } catch (error) {
      console.error(error)
      next(error)
     }
      // res.status(201).json({message: "post made"})
}



export const getRestaurant = async(req: Request<{restaurantId: string}>, res: Response, next: NextFunction):Promise<void> =>{
 const { restaurantId } = req.params;   
  if(!restaurantId){ 
    errorFunction(res, 400, "Invalid id")
       return
      } 
 try {
  const client = await initializeRedisClient();
  const restaurantKey = restaurantKeyById(restaurantId);
  const ifExists = await client.exists(restaurantKey);
  if(!ifExists){
    errorFunction(res, 404, "Restaurant not found")
    return
  }
  const [viewCount, data] = await Promise.all([client.hIncrBy(restaurantKey, "viewCount", 1),
    client.hGetAll(restaurantKey)]);
 successResponse(res, data, "Success")
 return 
 } catch (error) {
  next(error)
 }

}