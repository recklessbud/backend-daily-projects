import { Router } from "express";
import * as user_Controller from '../controllers/users.controllers';
const router = Router();


router.get("/", user_Controller.getAllUsers);
router.post("/", user_Controller.createUsers);
router.put("/:id", user_Controller.updateUsers);
router.get("/:username", user_Controller.getUsers);
router.delete("/:id", user_Controller.deleteUsers);


export default router