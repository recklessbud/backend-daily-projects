/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logs.utils";
// import prisma from "../config/dbconn";
import "../config/passport"
// import bcrypt from "bcrypt"
import passport from "passport";
import { IVerifyOptions } from "passport-local";
import {  Register } from "../utils/validator.utils";
import { AuthService } from "../services/auth.service";
import { User } from "@prisma/client";
import { errorResponse, successResponse } from "../utils/responses.utils";
// import { error } from "console";



export const getlogin = (req: Request, res: Response):void => {
    res.render("auth/login", {
        title: "Login",
        messages: req.flash("errors"),
        user: req.user
    });
};

export const getSignup = (req: Request, res: Response):void => {
    if(req.user){
        return res.redirect("/")
    }
    res.render("auth/signup", {
        title: "Signup",    
        messages: req.flash("errors"),
        user: req.user
    });
};

export const getProfile = (req: Request, res: Response):void => {
    res.render("auth/profile", {
        title: "Profile", 
        user: req.user, 
        messages: req.flash("errors")
    });	
}




export const postSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
     const body = req.body as Register;
     const existingUser = await AuthService.findUser(body.username, body.email);
     
     if(existingUser){
         res.status(400).json({ message: "User already exists" });
         return;
     }

     const newUser = await AuthService.createUser(body);
     logger.info(`New user registered: ${body.username}`);
      await AuthService.session({
        userId: newUser.id,
        userAgent: req.headers["user-agent"] || "",
        ipAddress: req.ip
    });
     
     successResponse(res, 201).redirect("/dashboard")
     return;

   } catch (error) {
     logger.error('Signup error:', error);
     next(error);
   }
}

export const postLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        passport.authenticate(
          "local",
          async(err: Error, user: User, info: IVerifyOptions) => {
            if (err) {
              logger.error('Authentication error:', err);
              return next(err);
            }
    
            if (!user) {
              logger.info(`Failed login attempt for user: ${req.body.username}`);
              return res.status(401).json({
                status: 'error',
                message: info.message || 'Authentication failed'
              });
            }
    
            req.logIn(user, async(err) => {
              if (err) {
                logger.error('Login error:', err);
                return next(err);
              }

              try {
                // Create session
                 await AuthService.session({
                  userId: user.id,
                  userAgent: req.headers["user-agent"] || "",
                  ipAddress: req.ip
                });
    
                logger.info(`Successful login for user: ${user.username}`);
                
                return successResponse(res, 200).redirect("/dashboard")	
              } catch (sessionError) {
                logger.error('Session creation error:', sessionError);
                return next(sessionError);
              }
            });
          }
        )(req, res, next);
      } catch (error) {
        logger.error('Login error:', error);
        next(error);
      }
    };

export const getLogout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.isAuthenticated()) {
            errorResponse(res, 401).json({ message: "Unauthorized" });
            return;
        }

        const userId = (req.user as User).id;
        
        // Delete the session from database
        await AuthService.deleteSession(userId);

        req.logout((err) => {
            if (err) {
                logger.error('Logout error:', err);
                return next(err);
            }
            
            req.session.destroy((err) => {
                if (err) {
                    logger.error('Session destruction error:', err);
                    return next(err);
                }
                
                logger.info(`User logged out: ${userId}`);
                res.status(200).json({ message: "Successfully logged out" });
            });
        });
    } catch (error) {
        logger.error('Logout error:', error);
        next(error);
    }
};