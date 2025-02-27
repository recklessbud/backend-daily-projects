/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { verifyRefreshToken, verifyAccessToken } from "../utils/token.utils";
import { errorResponse } from "../utils/responses.utils";
import prisma from "../config/dbconn";
import jwt from "jsonwebtoken";
import { compareSync } from "bcryptjs";


interface JwtPayloadExtended {
    id: string;
    username: string | null;
    // Add other properties if needed,
    email: string
  }
  

declare module 'express-serve-static-core' {
    interface Request {
      user?: JwtPayloadExtended
    }
  }
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return errorResponse(res, 401).render("auth/login", { message: "Unauthorized" });
    }

    try {
        const decodedToken = verifyRefreshToken(token) as { id: string; username: string };

        const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });

        if (!user) {
            return errorResponse(res, 401).redirect("/errors/401");
        }

        req.user = user;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return errorResponse(res, 500).redirect("/errors/500");
        }

        next(error);
    }
};


export const checkRole = (roles: string[])=>{
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user?.id
                }, 
                include: {
                    role: true
                }
            })
            // console.log(user, user?.role);
            if(!user || !roles.includes(user.role.name)){
                return errorResponse(res, 403).render('errors/403', {title: '403 - Forbidden', message: 'Forbidden'});
            }
            next()
        } catch (error) {
            const err = error as Error;
            console.log(err);
            return errorResponse(res, 500).render('errors/500', {title: '500 - Internal Server Error', message: 'Internal Server Error'});
        }
    }
}


