import { Request, Response, NextFunction } from "express";
import {successResponse , errorResponse} from '../utils/responses.util'

export const otherPage = (req: Request, res: Response, next: NextFunction) => {
    try {
        successResponse(res, 200).render('start');
    } catch (error) {
        console.log(error)
        errorResponse(res, 500).json({ error: 'Internal Server Error' });
    }
}