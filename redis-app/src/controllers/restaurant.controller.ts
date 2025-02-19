import type { Request, Response, NextFunction } from "express";
// import * as errorHandler from '../middleware/errorHandler.middleware.ts'
// import { create } from "domain";
import * as validateSchema from '../utils/validation.utils.ts'
import { validate } from "../middleware/inputValidation.middleware.ts"; 
import { initializeRedisClient } from "../utils/redisClient.ts";
import { nanoid } from "nanoid";
import { restaurantKeyById, reviewKeyById, reviewDetailsById, cuisineKeyById, cuisinesKey, restaurantCuisine, restaurantsByRatingScore } from "../utils/keys.ts";
import { successResponse, errorFunction } from "../utils/responses.ts";
// import { time } from "console";
// import { promise } from "zod";


export const createRestaurant = async(req: Request, res: Response, next: NextFunction): Promise<void>  => {
     const body = req.body as validateSchema.RestaurantSchema;
     try {
      const client = await initializeRedisClient();
      const id =  nanoid();
      const restaurantKey: string = restaurantKeyById(id);
      const hashData = { id, name: body.name, location: body.location, };
      await Promise.all([
       ...body.cuisines.map((cuisine)=> Promise.all([
        client.sAdd(cuisinesKey, cuisine),
        client.sAdd(restaurantCuisine(id), cuisine),
        client.sAdd(cuisineKeyById(cuisine), id)
       ])),
       client.hSet(restaurantKey, hashData),
       client.zAdd(restaurantsByRatingScore, {
        score: 0,
        value: id
       })
      
      ]);
      // console.log(`added ${addData}`)
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
  const [viewCount, data, cuisines] = await Promise.all([
    client.hIncrBy(restaurantKey, "viewCount", 1),
    client.hGetAll(restaurantKey),
    client.sMembers(restaurantCuisine(restaurantId))
  ]) ;
 successResponse(res, {...data, cuisines})
 return 
 } catch (error) {
  next(error)
 }

}

export const reviews = async(req: Request<{restaurantId: string}>, res: Response, next: NextFunction): Promise<void> => {
  const { restaurantId } = req.params;
  if(!restaurantId){
    errorFunction(res, 400, "Invalid id")
  }
  const data = req.body as validateSchema.ReviewSchema
  try {
    const client = await initializeRedisClient();
    const reviewId = nanoid();
    const reviewKey = reviewKeyById(restaurantId); 
    const restaurantKey = restaurantKeyById(restaurantId);
    const ifExists = await client.exists(restaurantKey);
    if(!ifExists){
      errorFunction(res, 404, "Review already exists")
      return;
    }
    const reviewDetailsKey = reviewDetailsById(reviewId);
 const reviewData = {id: reviewId, ...data, timestamp: Date.now(), restaurantId}
   const [reviewCount, setResults, totalStars] = await Promise.all([
      client.lPush(reviewKey, reviewId), 
      client.hSet(reviewDetailsKey, reviewData),
      client.hIncrByFloat(restaurantKey, "totalStars", data.ratings)
    ])

    const averageRating = Number((totalStars / reviewCount).toFixed(1));
    await Promise.all([
      client.zAdd(restaurantsByRatingScore, {
        score: averageRating,
        value: restaurantId
      }),
      client.hSet(restaurantKey, "averageRating", averageRating)
    ])
    successResponse(res, reviewData, "Success")
    return
  } catch(error) {
    next(error)
  }
}

export const getReviews = async(req: Request<{restaurantId: string}>, res: Response, next: NextFunction): Promise<void> => {
  const { restaurantId } = req.params;
  const {page = 1, limit = 10} = req.query;	
  const start = (Number(page) -1) * Number(limit);
  const end = start + Number(limit);
   if(!restaurantId){
    errorFunction(res, 400, "Invalid id")
   }
   try {
    const client = await initializeRedisClient();
    const reviewKey = reviewKeyById(restaurantId);
    const reviewIds = await client.lRange(reviewKey, start, end);
    const reviews = await Promise.all(
      reviewIds.map((id) => client.hGetAll(reviewDetailsById(id))))
      successResponse(res, reviews, "Success")
   } catch (error) {
    next(error)
   }
}


export const deleteReview = async(req: Request<{restaurantId: string, reviewId: string}>, res: Response, next: NextFunction): Promise<void> => {
  const { restaurantId, reviewId } = req.params;
  if(!restaurantId || !reviewId){
    errorFunction(res, 400, "Invalid id")
  }
  try {
    const client = await initializeRedisClient()
    const reviewKey = reviewKeyById(restaurantId);
    const reviewDetailsKey = reviewDetailsById(reviewId);
    const [removeResult, deleteResult] = await Promise.all([
      client.lRem(reviewKey, 0, reviewId),
      client.del(reviewDetailsKey)
    ])
    if(removeResult === 0 && deleteResult === 0){
      errorFunction(res, 404, "Review not found")
    }
    successResponse(res, reviewId, "Success")
  } catch (error) {
    next(error)
  }
}


export const getPagination = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {page = 1, limit = 10} = req.query;
  const start = (Number(page) -1) * Number(limit);
  const end = start + Number(limit);
  try {
    const client = await initializeRedisClient();
    const data = await client.zRange(restaurantsByRatingScore, start, end, {REV: true});
    const restaurant = await Promise.all(
      data.map((id) => client.hGetAll(restaurantKeyById(id)))
    );
    successResponse(res, restaurant, "Success")
  } catch (error) {
    next(error)
  }
}