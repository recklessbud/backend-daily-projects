/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responses.utils";
import { logger } from "../utils/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    logger.error('Server error', { error: err.message });
    errorResponse(res, 500).render('errors/500', { title: "500 - Internal Server Error", message: err.message });   
}

