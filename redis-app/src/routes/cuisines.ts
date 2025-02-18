import { Router } from "express";
import * as cuisinesController from '../controllers/cuisines.controller.ts'
const router = Router();


router.get('/', cuisinesController.getCuisines)

router.get('/:cuisine', cuisinesController.getSingleCuisines)


export default router
