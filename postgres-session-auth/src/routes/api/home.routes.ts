import { Router } from "express";
import * as homeController from "../../controllers/home.controller"
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = Router()

//@route    GET /api/v1
//@desc     home
router.get("/", homeController.homeController)

// router.get("/dashboard", homeController.dashboardController)
router.get("/dashboard", isAuthenticated, (req, res)=>{
    res.status(200).render("dashboard", {title: "Dashboard", user: req.user});
})




 




export default router