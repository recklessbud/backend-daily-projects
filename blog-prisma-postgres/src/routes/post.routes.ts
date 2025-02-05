import { Router } from "express";
import * as post_Controller from '../controllers/posts.controller';
const router = Router();


router.get("/", post_Controller.getAllPosts);
router.get("/:id", post_Controller.getPost);
router.post("/", post_Controller.createPost);
router.put("/:id", post_Controller.updatePost);
router.delete("/:id", post_Controller.deletePost);


export default router