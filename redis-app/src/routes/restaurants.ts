import { Router } from "express";
import * as restaurantController from '../controllers/restaurant.controller.ts'
import {validate}  from "../middleware/inputValidation.middleware.ts"; 
import * as validateSchema from '../utils/validation.utils.ts'
const router = Router();

// router.post('/', validate(validateSchema.ValidateRestaurantSchema), restaurantController.createRestaurant)
router.get('/', restaurantController.getPagination)	
router.post('/',validate(validateSchema.ValidateRestaurantSchema), restaurantController.createRestaurant)
router.get('/:restaurantId', restaurantController.getRestaurant)
router.get('/:restaurantId/weather', restaurantController.restaurantWeather)
router.post('/:restaurantId/reviews', validate(validateSchema.Review), restaurantController.reviews)
router.get('/:restaurantId/reviews', restaurantController.getReviews)
router.delete('/:restaurantId/reviews/:reviewId', restaurantController.deleteReview)
router.delete('/:restaurantId', restaurantController.deleteRestaurant)
router.post('/:restaurantId/details', validate(validateSchema.ValidateRestaurantDetails), restaurantController.createRestaurantDetails)
router.get('/:restaurantId/details', restaurantController.getRestaurantDetails)
router.get('/search/query', restaurantController.getSearch)

export default router 



