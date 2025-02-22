import { Router } from "express";
import { getHomePage, error500Page } from "../controllers/home.controller";

const router = Router();

// @route   GET /
// desc     Get home page
router.get("/", getHomePage);

//@route   GET /500
//desc     Get 500 page
router.get("/error", error500Page);
export default router;