import type { Request, Response, NextFunction } from "express";
// import * as errorHandler from '../middleware/errorHandler.middleware.ts'
// import { create } from "domain";
import * as validateSchema from '../utils/validation.utils.ts'
import { validate } from "../middleware/inputValidation.middleware.ts"; 
import { initializeRedisClient } from "../utils/redisClient.ts";



export const createRestaurant = async(req: Request, res: Response): Promise<void>  => {
     const body = req.body as validateSchema.RestaurantSchema;
     const client = await initializeRedisClient()
      res.status(201).json({message: "post made"})
}