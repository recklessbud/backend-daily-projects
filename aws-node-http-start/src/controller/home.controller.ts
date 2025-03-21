import { Request, Response, NextFunction } from "express";
import {successResponse , errorResponse} from '../utils/responses.util'

export const homePage = (req: Request, res: Response, next: NextFunction) => {
    return successResponse(res, 200).render('index');
 
}