/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request, Response, NextFunction } from "express";
// import * as Auth_model from "../models/auth.models";
import { errorResponse, successResponse } from "../utils/responses.utils";
import prisma  from "../config/dbconn";
import { Role } from "@prisma/client";
// import bcrypt from "bcryptjs";
import { Login, Register } from "../utils/validation.utils";
// import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.utils";

export const getAdminPage = (req: Request, res: Response, next: NextFunction) => {
    successResponse(res, 200).render('users/superAdmin/superAdmin', {title: 'Admin'});
}


export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.user.findMany({
        where: {
            role: {
                NOT: {
                    name: 'SUPER_ADMIN', 
                }
            }
        },
        select: {
            id: true,
            username: true,
            email: true,
            role: true
        },
    });
    successResponse(res, 200).render('users/superAdmin/superAdmin', {title: 'Admin', users: users});
}
export const getEditUserPage = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            role: true
        }
    
    });

    const roles = await prisma.role.findMany();
   
    console.log(user, user?.role)
    if(!user) return errorResponse(res, 404).render('errors/404', {title: 'Admin', message: 'User not found'});
    successResponse(res, 200).render('users/superAdmin/edit', {title: 'Admin', user: user, roles: roles});
}





export const updateUserRole = async(req: Request, res: Response, next: NextFunction) => {
    const {userId} = req.params
    const {username, roleId} = req.body
    
    
    const user = await prisma.user.findUnique({where: {id: userId}});
    if(!user) return errorResponse(res, 404).render('errors/404', {title: 'Admin', message: 'User not found'});
    
    const updatedUser = await prisma.user.update(
        {
            where: {id: userId}, 
            data: {
                username: username,
               roleId: roleId
         }  
    });
    
    console.log(updatedUser);

    successResponse(res, 200).redirect("/users/superadmin");
}

// export const getSingleUser = async(req: Request, res: Response, next: NextFunction) => {
//     const { userId, role } = req.params
//     const user = await prisma.user.findUnique({where: {id: userId}});
//     if(!user) errorResponse(res, 404).render('users/admin-dashboard', {title: 'Admin', message: 'User not found'});
//    successResponse(res, 200).render('users/admin-dashboard', {title: 'Admin', user: user});

// }
