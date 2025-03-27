import { Router } from "express";
import { homePage, postToDb } from "../../controller/home.controller";

const router = Router();

router.get("/", homePage);
router.post("/", postToDb);

export default router;