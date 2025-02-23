/* eslint-disable @typescript-eslint/no-unused-vars */
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const error401Page = (req: Request, res: Response, next: NextFunction) => {
    errorResponse(res, 401).render('errors/401', { title: "401 - Unauthorized", message: "Unauthorized" });
}


export const error404Page = (req: Request, res: Response, next: NextFunction) => {
    errorResponse(res, 404).render('errors/404', { title: "404 - Not Found", message: "Not Found" });   
};


; // Adjust the import path as necessary

export const getDashboard = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
  successResponse(res, 200).render('users/dashboard', { title: 'Dashboard', user: user });

}