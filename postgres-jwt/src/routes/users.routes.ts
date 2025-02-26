import express from "express"
// import * as Auth_Controller from "../controllers/auth.controller"
// import * as Validation_Middleware from "../middlewares/validation.middleware"
// import { authMiddleware } from "../middlewares/auth.middleware";
// import { loginSchema, registerSchema } from "../utils/validation.utils";
import { authMiddleware, checkRole } from "../middlewares/auth.middleware";
import { getAllUsers, getEditUserPage, updateUserRole } from "../controllers/admin.controller";

const router = express.Router();


router.get('/admin', authMiddleware, checkRole(['ADMIN']), getAllUsers);

router.get("/moderator", authMiddleware, checkRole(['MODERATOR', 'ADMIN']), (req, res)=>{
    res.send("vsvs")
});

router.get('/admin/edit/:userId', authMiddleware, checkRole(['ADMIN']), getEditUserPage);

// router.post('/admin/:userId/:role', authMiddleware, checkRole(['ADMIN']), updateUserRole);
router.post('/admin/update/:userId', authMiddleware, checkRole(['ADMIN']), updateUserRole)

export default router