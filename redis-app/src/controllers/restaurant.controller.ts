import type { Request, Response, NextFunction } from "express";
// import * as errorHandler from '../middleware/errorHandler.middleware.ts'
// import { create } from "domain";
import * as validateSchema from '../utils/validation.utils.ts'
import { validate } from "../middleware/inputValidation.middleware.ts"; 



export const createRestaurant = async(req: Request, res: Response): Promise<void>  => {
     const body = req.body as validateSchema.RestaurantSchema;
      res.status(201).json({message: "post made"})
}