import type { Request, Response, NextFunction } from "express";
import { errorFunction } from "../utils/responses.ts";


export const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    errorFunction(res, 500, err)
}