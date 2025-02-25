/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request, Response, NextFunction } from "express";
// import * as Auth_model from "../models/auth.models";
import { errorResponse, successResponse } from "../utils/responses.utils";
import prisma  from "../config/dbconn";
// import bcrypt from "bcryptjs";
import { Login, Register } from "../utils/validation.utils";
// import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.utils";

export const getAdminPage = (req: Request, res: Response, next: NextFunction) => {
    successResponse(res, 200).render('users/admin-dashboard', {title: 'Admin'});
}


export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.user.findMany({
        where: {
            role: {
                NOT: {
                    name: 'ADMIN'
                }
            }
        }
    });
    successResponse(res, 200).render('users/admin-dashboard', {title: 'Admin', users: users});
}