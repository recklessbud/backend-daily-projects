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
import { sendEEmail } from "../services/email.service";
import prisma from "../config/dbconn";
import { generateResetToken } from "../utils/token.utils";
import { hashPassword } from "../config/passport";
// impor hashPassword
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

export const getForgotPassword = (req: Request, res: Response):void => {
    res.render("auth/forgot", {
        title: "Forgot Password",
        user: req.user,
        message: ""
    })
}



export const postSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
     const body = req.body as Register;
     const existingUser = await AuthService.findUser(body.username, body.email);
     
     if(existingUser){
       errorResponse(res, 409).json({message: "User already exists"});	
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



export const requestPasswordReset = async(req: Request, res: Response):Promise<any> => {
  const {email} = req.body
  
  try {
     const userEmail =  await prisma.user.findUnique({
      where: {
        email: email
      }
     })
     if(!userEmail){
       return errorResponse(res, 400).render("auth/signup", {message: "User not found, please create account"}) 
     }
     const resetToken = generateResetToken({id: userEmail.id, username: userEmail.username})
   userEmail.resetPasswordToken = resetToken
   userEmail.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000)

   await prisma.user.update({
    where: {
      id: userEmail.id
    },
    data: {
      resetPasswordToken: resetToken,
      resetTokenExpiry: new Date(Date.now() + 10 * 60 * 1000)
    }
   })
    
   const resetLink = `${process.env.BASE_URL}/api/v1/auth/${resetToken}/reset-password`
   const emailText= `
   Hello ${userEmail.username},

     Click the link below to reset your password:
       ${resetLink}

       This link will expire in 10 minutes.

   If you didn’t request this, please ignore it.`
     
   await sendEEmail(userEmail.email, "Password reset", emailText)	
   logger.info(`Password reset link sent to ${userEmail.email}`)
   console.log("token:", resetToken)
   return successResponse(res, 200).render("auth/forgot", {message: "Password reset link sent to your email"})
  } catch (error) {
   console.log(error)
   logger.error('Password reset error:', error)
   return errorResponse(res, 500).json({message: "Internal server error"})
  }

}


export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { resetToken } = req.params;
  const { newPassword, confirmPassword } = req.body;

  try {
      // Validate passwords match
      if (newPassword !== confirmPassword) {
          errorResponse(res, 400).json({message: "Passwords do not match"});
      }

      // Find user with valid reset token
      const user = await prisma.user.findFirst({
          where: {
              resetPasswordToken: resetToken,
              resetTokenExpiry: {
                  gt: new Date() // Check if token hasn't expired
              }
          }
      });

      if (!user) {
          // logger.info('Invalid or expired password reset token attempted');
          errorResponse(res, 400).json({message: "Invalid or expired password reset token"});
      }

      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);

      // Update user password and clear reset token
      await prisma.user.update({
          where: {
              id: user?.id
          },
          data: {
              password: hashedPassword,
              resetPasswordToken: null, // Clear the reset token
              resetTokenExpiry: null  // Clear the expiry
          }
      });

      logger.info(`Password reset successful for user: ${user?.username}`);

       successResponse(res, 200).render("auth/login", {
          title: "Login",
          message: "Password reset successful. Please login with your new password.",
          user: null
      });

  } catch (error) {
      logger.error('Password reset error:', error);
      next(error);
  }
};

// export const getReset = (req: Request, res: Response)=>{
//   res.render("auth/resetPass", {resetToken: req.params.resetPasswordToken})
// }

export const getReset = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;  // Get token from URL params

  try {
      // Verify token is valid
      const user = await prisma.user.findFirst({
          where: {
              resetPasswordToken: token,
              resetTokenExpiry: {
                  gt: new Date()
              }
          }
      });

      if (!user) {
          logger.info('Invalid reset token accessed');
          return res.redirect('/api/v1/auth/forgot');
      }

      // Render reset password page with token
      res.render('auth/resetPass', {
          title: 'Reset Password',
          resetToken: token,
          user: null
      });
  } catch (error) {
      logger.error('Error in reset password page:', error);
      res.redirect('/api/v1/auth/forgot');
  }
};