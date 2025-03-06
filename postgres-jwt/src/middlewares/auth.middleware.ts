/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { verifyRefreshToken, verifyAccessToken } from "../utils/token.utils";
import { errorResponse } from "../utils/responses.utils";
import prisma from "../config/dbconn";
import jwt from "jsonwebtoken";
import { compareSync } from "bcryptjs";
import { logger } from "../utils/logger";


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
        logger.warn('Authentication failed: No token provided', {
            path: req.path,
            ip: req.ip
        });
        return errorResponse(res, 401).render("auth/login", { message: "Unauthorized" });
    }

    try {
        const decodedToken = verifyRefreshToken(token) as { id: string; username: string };

        const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });

        if (!user) {
            logger.warn('Authentication failed: User not found', {
                userId: decodedToken.id,
                path: req.path
            });
            return errorResponse(res, 401).redirect("/errors/401");
        }

        req.user = user;

        logger.info('User authenticated successfully', {
            userId: user.id,
            path: req.path
        });

        next();
    } catch (error) {

        logger.error('Authentication error', {
            error: error instanceof Error ? error.message : 'Unknown error',
            path: req.path,
            ip: req.ip
        });
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
                logger.warn('Forbidden');
                return errorResponse(res, 403).render('errors/403', {title: '403 - Forbidden', message: 'Forbidden'});
            }
            next()
        } catch (error) {
            const err = error as Error;
            console.log(err);
            logger.error('Server error', { error: err.message });
            return errorResponse(res, 500).render('errors/500', {title: '500 - Internal Server Error', message: 'Internal Server Error'});
        }
    }
}


