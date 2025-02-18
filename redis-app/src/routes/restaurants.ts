import { Router } from "express";
import * as restaurantController from '../controllers/restaurant.controller.ts'
import {validate}  from "../middleware/inputValidation.middleware.ts"; 
import * as validateSchema from '../utils/validation.utils.ts'
const router = Router();

// router.post('/', validate(validateSchema.ValidateRestaurantSchema), restaurantController.createRestaurant)

router.post('/',validate(validateSchema.ValidateRestaurantSchema), restaurantController.createRestaurant)
router.get('/:restaurantId', restaurantController.getRestaurant)

router.post('/:restaurantId/reviews', validate(validateSchema.Review), restaurantController.reviews)
router.get('/:restaurantId/reviews', restaurantController.getReviews)
router.delete('/:restaurantId/reviews/:reviewId', restaurantController.deleteReview)

export default router 



