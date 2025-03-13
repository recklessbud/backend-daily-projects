import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logs.utils";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    
    // Log the failed authentication attempt
    logger.info(`Unauthorized access attempt: ${req.path}`);
    
    // Redirect to login page instead of sending JSON response
    return res.redirect('/api/v1/auth/login');
};

export const isGuest = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    
    // Redirect authenticated users to dashboard
    return res.redirect('/dashboard');
};