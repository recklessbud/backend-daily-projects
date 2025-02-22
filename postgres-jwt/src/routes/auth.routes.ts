import express from "express"
import * as Auth_Controller from "../controllers/auth.controller"
import * as Validation_Middleware from "../middlewares/validation.middleware"
// import { authMiddleware } from "../middlewares/auth.middleware";
import { loginSchema, registerSchema } from "../utils/validation.utils";

const router = express.Router();

//@route   GET /auth/login 
//desc     Get login page
router.get("/login", Auth_Controller.getLoginPage);

//@route   GET /auth/register
//desc     Get register page
router.get("/register", Auth_Controller.getRegisterPage);

//@route   POST /auth/login
//desc     Login user
router.post("/register", Validation_Middleware.validate(registerSchema), Auth_Controller.RegisterUser);


//@route   POST /auth/login
//desc     Login user
router.post("/login", Validation_Middleware.validate(loginSchema), Auth_Controller.loginUser);








export default router