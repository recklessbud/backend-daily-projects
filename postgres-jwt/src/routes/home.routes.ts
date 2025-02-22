import { Router } from "express";
import { getHomePage, error500Page, error404Page, error401Page, getDashboard } from "../controllers/home.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// @route   GET /
// desc     Get home page
router.get("/", getHomePage);

//@route   GET /500
//desc     Get 500 page
router.get("/error/500", error500Page);

//@route   GET /404
//desc     Get 401 page
router.get("/error/404", error404Page);

 //@route   GET /401
//desc     Get 401 page
router.get("/error/401", error401Page);


 //@route   GET /dashboard
//desc     Get dashboard page
router.get("/dashboard", authMiddleware, getDashboard);



export default router;