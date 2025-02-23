import { Router } from "express";
import yaml from "yamljs";
import swaggerUi from "swagger-ui-express";
import { getHomePage, error500Page, error404Page, error401Page, getDashboard } from "../controllers/home.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// @route   GET /
// desc     Get home page
router.get("/", getHomePage);

//@route   GET /500
//desc     Get 500 page
router.get("/errors/500", error500Page);

//@route   GET /404
//desc     Get 401 page
router.get("/errors/404", error404Page);

 //@route   GET /401
//desc     Get 401 page
router.get("/errors/401", error401Page);


 //@route   GET /dashboard
//desc     Get dashboard page
router.get("/users/dashboard", authMiddleware, getDashboard);



//@route   GET /docs
//desc     Get docs page
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(yaml.load("./swagger.yaml")));



export default router;