import express from "express"
// import * as Auth_Controller from "../controllers/auth.controller"
// import * as Validation_Middleware from "../middlewares/validation.middleware"
// import { authMiddleware } from "../middlewares/auth.middleware";
// import { loginSchema, registerSchema } from "../utils/validation.utils";
import { authMiddleware, checkRole } from "../middlewares/auth.middleware";
import { getAllUsers } from "../controllers/admin.controller";

const router = express.Router();


router.get('/admin', authMiddleware, checkRole(['ADMIN']), getAllUsers);



export default router