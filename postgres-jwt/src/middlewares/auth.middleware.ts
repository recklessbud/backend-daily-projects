import { Request, Response, NextFunction } from "express";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { verifyRefreshToken, verifyAccessToken } from "../utils/token.utils";
import { errorResponse } from "../utils/responses.utils";
import prisma from "../config/dbconn";
import jwt from "jsonwebtoken";

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
    try {
        // Extract the token from cookies or headers
        const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
        if (!token) {
           errorResponse(res, 401).json({ message: "Unauthorized" });
           return // Redirect if no token is found
        }

        // Verify token
        const decoded = verifyAccessToken(token) as JwtPayloadExtended;

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
             errorResponse(res, 401).redirect("/errors/401")
             return;
        } 
 
        // Attach user info to request
        req.user = user;
        
        // Proceed to next middleware or route
        next();
    } catch (error) {
        console.error("Authentication error:", error);

        // Handle expired/invalid token error
        if (error instanceof jwt.JsonWebTokenError) {
            errorResponse(res, 500).redirect("/errors/500");
            return // Redirect to error page
        }

        next(error); // Pass other errors to the global error handler
    }
};



