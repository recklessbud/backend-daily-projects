import { Router } from "express";
import { homePage } from "../../controller/home.controller";

const router = Router();

router.get("/", homePage);

export default router;