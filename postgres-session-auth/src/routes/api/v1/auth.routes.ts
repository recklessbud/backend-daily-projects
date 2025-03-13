import * as AuthController from "../../../controllers/auth.controller";
import { Router } from "express";
import { loginSchema, registerSchema } from "../../../utils/validator.utils";
import { isAuthenticated, isGuest } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/zod.middleware";

const router = Router();

//@route       POST /api/v1/auth/signup
//@desc        signup
router.post("/signup", isGuest, validate(registerSchema), AuthController.postSignup);
 

//@route    POST /api/v1/auth/signup
//@desc     login
router.post("/login", isGuest, validate(loginSchema), AuthController.postLogin);


//@route    GET /api/v1/auth/logout
//@desc     logout
router.get("/logout", isAuthenticated, AuthController.getLogout);

router.get('/login', isGuest, AuthController.getlogin);
router.get('/signup', isGuest, AuthController.getSignup);






export default router