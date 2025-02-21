import type{ Request, Response, NextFunction } from "express";
import { initializeRedisClient } from "../utils/redisClient.ts";
import { errorFunction, successResponse } from "../utils/responses.ts";
import { cuisinesKey, cuisineKeyById, restaurantKeyById  } from "../utils/keys.ts";

interface reqResNext{
    req: Request,
    res: Response,
    next: NextFunction;
}

export const getCuisines = async({req, res, next}: reqResNext): Promise<void> => {
    try{
        const client = await initializeRedisClient()
       const cuisines =  await client.sMembers(cuisinesKey)
       successResponse(res, cuisines, "Success")
    }catch(error){
      next(error
      )
    }
}


export const getSingleCuisines = async(req:Request, res:Response, next: NextFunction): Promise<void> => {
    const cuisine = req.params.cuisine 
    try {
        const client = await initializeRedisClient()
        const restaurantId = await client.sMembers(cuisineKeyById(cuisine as string));
        const restaurants = await Promise.all(restaurantId.map((id)=> client.hGet(restaurantKeyById(id), "name"))
    );
     successResponse(res, restaurants, "Success")
    } catch (error) {
        next(error)
    }} 