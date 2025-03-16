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

//@route    POST /api/v1/auth/signup
//@desc     signup
router.post("/forgot", isGuest, AuthController.requestPasswordReset);

//@route    GET /api/v1/auth/logout
//@desc     logout
router.get("/logout", isAuthenticated, AuthController.getLogout);

//@route    POST /api/v1/auth/:password/reset-password
//@desc     update 
router.post("/:token/reset-password", AuthController.resetPassword);

//@route    GET /api/v1/auth/login
//@desc     login
router.get('/login', isGuest, AuthController.getlogin);

//@route    GET /api/v1/auth/signup
//@desc     signup
router.get('/signup', isGuest, AuthController.getSignup);


//@route    GET /api/v1/auth/forgot
//@desc     forgot password
router.get('/forgot', isGuest, AuthController.getForgotPassword);

//@route    GET /api/v1/auth/reset-password
//@desc     reset password
router.get('/:token/reset-password', isGuest, AuthController.getReset);

export default router