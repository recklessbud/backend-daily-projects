import { Router } from "express";
import { Response, Request, NextFunction } from "express";
import { getHome, getLogin } from "../controllers/home.controller";
import { successResponse } from "../utils/responses.util";


const router = Router();

router.get('/', getHome);	

// router.get('*', (req: Request, res: Response) => {
//   successResponse(res, 404).json({ error: 'Route not found' });
// });

router.get('/login', getLogin)

export default router;