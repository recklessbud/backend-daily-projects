import { Router } from "express";
import { otherPage } from "../../controller/other.controller";

const router = Router();

router.get("/", otherPage);


export default router;