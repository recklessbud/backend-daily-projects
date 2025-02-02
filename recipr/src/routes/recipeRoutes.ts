import { Router } from "express";
import { isAuthenticated, isGuest } from "../middleware/authenticated";
import { postRecipe, getPostRecipe, getEditRecipe, updateRecipe, deleteRecipe, getSingleRecipe } from "../controllers/recipeController";
import multer from "../middleware/multer";

const router = Router();

router.get("/create", isAuthenticated, getPostRecipe);

router.post("/create", multer.single("file"), postRecipe);

router.get("/edit/:id", isAuthenticated, getEditRecipe);

router.post("/edit/:id", multer.single("file"), updateRecipe);

 
router.post("/delete/:id", isAuthenticated, deleteRecipe)












export default router