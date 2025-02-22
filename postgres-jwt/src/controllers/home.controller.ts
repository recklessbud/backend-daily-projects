import { Request, Response, NextFunction } from "express";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { successResponse, errorResponse } from "../utils/responses.utils";
// import { title } from "process";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getHomePage = (req: Request, res: Response, next: NextFunction) => {
    successResponse(res, 200).render('home', {title: 'Home'});
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const error500Page = (req: Request, res: Response, next: NextFunction) => {
    errorResponse(res, 500).render('errors/500', { title: "500 - Internal Server Error", message: "Internal Server Error" });   
};