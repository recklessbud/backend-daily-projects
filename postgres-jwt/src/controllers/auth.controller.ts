/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request, Response, NextFunction } from "express";
// import * as Auth_model from "../models/auth.models";
import { errorResponse, successResponse } from "../utils/responses.utils";
import prisma  from "../config/dbconn";
import bcrypt from "bcryptjs";
import { Login, Register } from "../utils/validation.utils";
// import { roleMiddleware } from "../middlewares/auth.middleware";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.utils";
// import { access } from "fs";
import { logger } from "../utils/logger";
import { log } from "console";


export const getLoginPage = (req: Request, res: Response) => {
    res.render('auth/login', {title: 'Login', message: ''});
};

export const getRegisterPage = async(req: Request, res: Response) => {
    const schools = await prisma.school.findMany({
        include: {
            faculties: {
                include: {
                    departments: true
                }
            }
        }
    });
    res.render('auth/register', {title: 'Register', message: '', schools: schools});
};




export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body as Login;
        const user = await prisma.user.findUnique({
            where: {
                username: body.username,
                email: body.email
            },
            include: {
                role: true
            }
        })
        if(!user){
            logger.warn('User not found');
            errorResponse(res, 401).render('auth/login', {title: 'Login', message: 'Invalid credentials.'});
            return;
        }
        const isMatch = await bcrypt.compare(body.password, user.password);
        if(!isMatch){
            logger.warn('Invalid password');
            errorResponse(res, 401).render('auth/login', {title: 'Login', message: 'Invalid credentials.'});
            return;
        }
    
        const accessToken = generateAccessToken({id: user.id, username: body.username});
        const refreshToken = generateRefreshToken({id: user.id, username: body.username});
    
        await prisma.session.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                userAgent: req.headers['user-agent'] || 'unknown',
                ipAddress: req.ip || "unknown"
            }
        })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            // maxAge:  7* 24 * 60 * 60 * 1000, // 7 days
            }
        )
       res.cookie('refreshToken', refreshToken, {
           httpOnly: true,
           secure: true,
           sameSite: 'strict',
           maxAge: 7 * 24 * 60 * 60 * 1000
       })
       console.log(accessToken);

       switch (user.role.name) {
        case "SUPER_ADMIN":
            logger.info('Super admin logged in', {userId: user.id});
            return res.redirect("/users/superadmin");
        case "ADMIN":
            logger.info('admin logged in', {userId: user.id})
            return res.redirect("/users/admin/dashboard");
        case "SUPERVISOR": 
        logger.info('supervisor logged in', {userId: user.id});
            return res.redirect("/users/supervisor/dashboard");
        case "STUDENT":
            logger.info('student logged in', {userId: user.id});
            return res.redirect("/users/students/dashboard");
        default:
            return res.redirect("/auth/login");
        }
    }

    


export const refresh = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { refreshToken } = req.cookies;
      if(!refreshToken){
        logger.warn('Refresh token not found');
          errorResponse(res, 401).render('errors/500', {title: 'Login', message: 'unauthorized'});
      }
        const decoded =  verifyRefreshToken(refreshToken) as { id: string, username: string };
        const session = await prisma.session.findUnique({ where: { token: refreshToken } });
        if (!session) {
            logger.warn('Session not found');
            res.status(403).json({ message: "Invalid refresh token" }) 
            return
        };

        const accessToken = generateAccessToken({ id: decoded.id, username: decoded.username });
        const newRefreshToken = generateRefreshToken({ id: decoded.id, username: decoded.username });

        await prisma.session.update({
            where: { token: refreshToken },
            data: { token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
          });
      
          // Set new refresh token in the cookie
          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge:  7* 24 * 60 * 60 * 1000, // 7 days
        });
         console.log(accessToken);

         logger.info('Refresh token refreshed', {userId: decoded.id});
         successResponse(res, 200).json({ accessToken });
        
}


export const RegisterUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const body = req.body as Register; 
    const existingUser = await prisma.user.findUnique({
      where: {
        username: body.username,
        email: body.email
      }, 
      include: {
        role: true,
      }
    })
    if(existingUser){
        logger.warn('User already exists');
        errorResponse(res, 409).render('auth/register', {title: 'Register', message: 'User already exists. Please login.'});
        return;
    }
      const school = await prisma.school.findUnique({
        where: {
            id: body.schoolId
        },
        include: {
            faculties:{
                where:{
                    id: body.facultyId
                },
                include: {
                    departments: {
                        where: {
                            id: body.departmentId
                        }
                    }
                }
            }
        }
      })
      if (!school || !school.faculties.length || !school.faculties[0].departments.length) {
      logger.warn('Invalid school, faculty or department selection');
        errorResponse(res, 400).render('auth/register', {
          title: 'Register', 
          message: 'Invalid school, faculty or department selection'
        });  
        return 
      }
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
        role: {
            connect: { 
                name: 'STUDENT'
            }
        }, 
        school: {
            connect: {
                id: body.schoolId
            }
        }, 
        faculty: {
            connect: {
                id: body.facultyId
            }
        }, 
        department: {
            connect: {
                id: body.departmentId
            }
        }
      }
    })
    const accessToken = generateAccessToken({id: user.id, username: body.username});
    const refreshToken = generateRefreshToken({id: user.id, username: body.username});
    await prisma.session.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            userAgent: req.headers['user-agent'] || 'unknown',
            ipAddress: req.ip || "unknown"
        }
    })
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge:  7* 24 * 60 * 60 * 1000, // 7 days
        }
    )
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    // req.session.id = user.id
    logger.info('User registered', {userId: user.id});
    successResponse(res, 302).redirect('/users/students/dashboard');
}

export const logout = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { refreshToken, accessToken } = req.cookies;
    if(!refreshToken || !accessToken){
        logger.warn('unauthorized');
        errorResponse(res, 401).render('users/dashboard', {title: 'dashboard', message: 'unauthorized', user: req.user});
        return
    }
    const token = await prisma.session.findUnique({ where: { token: refreshToken } });
    if (!token) {
        logger.warn('Invalid refresh token');
        res.status(403).render("users/dashboard", { message: "Invalid refresh token" , user: req.user}); 
        return
    };
    await prisma.session.delete({ where: { token: refreshToken } });
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    
    logger.info('User logged out', {userId: token.userId});
    successResponse(res, 200).redirect('/auth/login');
}