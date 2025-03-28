import express from "express"
// import * as Auth_Controller from "../controllers/auth.controller"
// import * as Validation_Middleware from "../middlewares/validation.middleware"
// import { authMiddleware } from "../middlewares/auth.middleware";
// import { loginSchema, registerSchema } from "../utils/validation.utils";
import { authMiddleware, checkRole } from "../middlewares/auth.middleware";
import { getAllUsers, getEditUserPage, updateUserRole } from "../controllers/superAdmin.controller";
import * as Admin from "../controllers/admin.controller";
import * as Student from "../controllers/students.controller"
import * as Supervisor from "../controllers/supervisor.controller"
import { upload } from "../config/multer.config";
import { cacheMiddleware } from "../middlewares/cache.middleware";

const router = express.Router();



router.get('/superadmin', authMiddleware, checkRole(['SUPER_ADMIN']), getAllUsers);

router.get("/supervisor", authMiddleware, checkRole(['SUPERVISOR', 'ADMIN']), (req, res)=>{
    res.send("vsvs")
});

router.get('/superadmin/edit/:userId', authMiddleware, checkRole(['SUPER_ADMIN']), getEditUserPage);

// router.post('/admin/:userId/:role', authMiddleware, checkRole(['ADMIN']), updateUserRole);
router.post('/superadmin/update/:userId', authMiddleware, checkRole(['SUPER_ADMIN']), updateUserRole)

//admins
router.get('/admin/dashboard', authMiddleware, checkRole(['ADMIN']), Admin.getAdminPage); 

router.get('/admin/edit/:userId', authMiddleware, checkRole(['ADMIN']), Admin.getEditPage);

router.post("/admin/update/:userId", authMiddleware, checkRole(['ADMIN']), Admin.updateUserRole);

router.post("/admin/school", authMiddleware, checkRole(['ADMIN']),Admin.createSchool)

router.post('/admin/schools/:schoolId/update', authMiddleware, checkRole(['ADMIN']), Admin.updateSchool);

router.post('/admin/schools/:schoolId/delete', authMiddleware, checkRole(['ADMIN']), Admin.deleteSchool);

router.post('/admin/:schoolId/faculties', authMiddleware, checkRole(['ADMIN']), Admin.createFaculty);

router.post('/admin/:schoolId/faculties/delete/:facultyId', authMiddleware, checkRole(['ADMIN']), Admin.deleteFaculty);

router.post('/admin/:schoolId/faculties/:facultyId/departments', authMiddleware, checkRole(['ADMIN']), Admin.createDepartment);

router.post('/admin/:schoolId/faculties/:facultyId/departments/delete/:departmentId', authMiddleware, checkRole(['ADMIN']), Admin.deleteDepartment);
 
router.get('/admin/departments/:departmentId/unassigned-students', authMiddleware, checkRole(['ADMIN']), Admin.getUnassignedStudents);

router.get('/admin/departments/:departmentId/supervisors', authMiddleware, checkRole(['ADMIN']), Admin.getSupervisors);

router.get("/admin/students/:studentId/assign", authMiddleware, checkRole(['ADMIN']), Admin.getStudentAssignPage);

router.post('/admin/students/:studentId/assign', authMiddleware, checkRole(['ADMIN']), Admin.assignSupervisor);







//supervisors
//  router.get('/supervisor/dashboard', authMiddleware, checkRole(['SUPERVISOR']), Supervisor.getSupervisorPage);
router.get('/supervisor/dashboard', authMiddleware, checkRole(['SUPERVISOR']), Supervisor.getProjects);

 router.get('/supervisor/students', authMiddleware, checkRole(['SUPERVISOR']), cacheMiddleware(200), Supervisor.getAssignedStudents);

 router.post('/supervisor/topics/:topicId/review', authMiddleware, checkRole(['SUPERVISOR']), Supervisor.reviewProjectTopic);
 
 router.post('/supervisor/projects/:projectId/review', authMiddleware, checkRole(['SUPERVISOR']), Supervisor.reviewProject);

router.get('/supervisor/projects/:projectId/download', authMiddleware, checkRole(['SUPERVISOR']), Supervisor.downloadProject);
 
//students 
router.get('/students/dashboard', authMiddleware, checkRole(['STUDENT']), Student.getStudentPage);

router.post('/students/project-topic', authMiddleware, checkRole(['STUDENT']), Student.createProjectTopic);

router.post('/students/project-topic/:projectTopicId/delete', authMiddleware, checkRole(['STUDENT']), Student.deleteProjectTopic);

router.post('/students/project-topic/:projectTopicId/update', authMiddleware, checkRole(['STUDENT']), Student.updateProjectTopic);

router.post("/students/projects/upload", authMiddleware, checkRole(['STUDENT']), upload.single('file'), Student.createProjects);

router.post('/students/projects/:projectId/delete', authMiddleware, checkRole(['STUDENT']), Student.deleteProjectFile);

 











export default router