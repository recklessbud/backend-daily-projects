import express from "express"
// import * as Auth_Controller from "../controllers/auth.controller"
// import * as Validation_Middleware from "../middlewares/validation.middleware"
// import { authMiddleware } from "../middlewares/auth.middleware";
// import { loginSchema, registerSchema } from "../utils/validation.utils";
import { authMiddleware, checkRole } from "../middlewares/auth.middleware";
import { getAllUsers, getEditUserPage, updateUserRole } from "../controllers/superAdmin.controller";
import * as Admin from "../controllers/admin.controller";
import * as Student from "../controllers/students.controller"

const router = express.Router();


router.get('/superadmin', authMiddleware, checkRole(['SUPER_ADMIN']), getAllUsers);

router.get("/supervisor", authMiddleware, checkRole(['SUPERVISOR', 'ADMIN']), (req, res)=>{
    res.send("vsvs")
});

router.get('/superadmin/edit/:userId', authMiddleware, checkRole(['SUPER_ADMIN']), getEditUserPage);

// router.post('/admin/:userId/:role', authMiddleware, checkRole(['ADMIN']), updateUserRole);
router.post('/superadmin/update/:userId', authMiddleware, checkRole(['SUPER_ADMIN']), updateUserRole)

router.get('/admin/dashboard', authMiddleware, checkRole(['ADMIN']), Admin.getAdminPage); 

router.get('/admin/edit/:userId', authMiddleware, checkRole(['ADMIN']), Admin.getEditPage);

router.post("/admin/update/:userId", authMiddleware, checkRole(['ADMIN']), Admin.updateUserRole);


router.get('/students/dashboard', authMiddleware, checkRole(['STUDENT']), Student.getStudentPage);




export default router