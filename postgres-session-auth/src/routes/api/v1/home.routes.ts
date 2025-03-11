import { Router } from "express";
import * as homeController from "../../../controllers/home.controller"

const router = Router()

//@route    GET /api/v1
//@desc     home
router.get("/", homeController.homeController)

 




export default router