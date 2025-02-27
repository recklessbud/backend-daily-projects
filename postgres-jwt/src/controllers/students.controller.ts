import { Request, Response } from "express";
import {  successResponse } from "../utils/responses.utils";


export const getStudentPage = (req: Request, res: Response) => {
    successResponse(res, 200).render('users/students/dashboard', {title: 'Students', user: req.user});
};