/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import prisma from "../config/dbconn";
import { errorResponse, successResponse } from "../utils/responses.utils";


export const getAdminPage = async(req: Request, res: Response, next: NextFunction) => {
    const admin = await prisma.user.findUnique({where: {id: req.user?.id}})
    const users = await prisma.user.findMany({
        where:{
            role: {
                NOT: {
                    name: {in: ['SUPER_ADMIN', 'ADMIN']}
                }
            }
        },
        select: {
            id: true,
            username: true,
            email: true,
            role: true
        },
    })
    successResponse(res, 200).render('users/admin/dashboard', {title: 'Admin', users: users, admin: admin});
}

export async function getEditPage(req: Request, res: Response, next: NextFunction): Promise<void> {
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
    if (!user) {
        errorResponse(res, 404).render('errors/404', { title: 'Admin', message: 'User not found' });
    }
    successResponse(res, 200).render('users/admin/edit', { title: 'Admin', user: user, roles: roles });

}



export const updateUserRole = async(req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const { roleId } = req.body

    const user =  await prisma.user.findUnique({where: {id: userId}});
     if(!user){
        return errorResponse(res, 404).render('errors/404', {title: 'Admin', message: 'User not found'});
     }

     const updateUser =  await prisma.user.update({
        where: {id: userId},
        data: {
            roleId: roleId
        }
     })
     console.log(updateUser);
     successResponse(res, 200).redirect('/users/admin/dashboard');
} 