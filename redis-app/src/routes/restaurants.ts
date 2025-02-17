import { Router } from "express";
import * as restaurantController from '../controllers/restaurant.controller.ts'
import {validate}  from "../middleware/inputValidation.middleware.ts"; 
import * as validateSchema from '../utils/validation.utils.ts'
const router = Router();

// router.post('/', validate(validateSchema.ValidateRestaurantSchema), restaurantController.createRestauran0t)

router.post('/',validate(validateSchema.ValidateRestaurantSchema), restaurantController.createRestaurant)
router.get('/:restaurantId', restaurantController.getRestaurant)

export default router 



