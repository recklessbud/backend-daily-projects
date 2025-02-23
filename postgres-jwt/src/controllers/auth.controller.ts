/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request, Response, NextFunction } from "express";
// import * as Auth_model from "../models/auth.models";
import { errorResponse, successResponse } from "../utils/responses.utils";
import prisma  from "../config/dbconn";
import bcrypt from "bcryptjs";
import { Login, Register } from "../utils/validation.utils";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.utils";
// import { access } from "fs";


export const getLoginPage = (req: Request, res: Response) => {
    res.render('auth/login', {title: 'Login', message: ''});
};

export const getRegisterPage = (req: Request, res: Response) => {
    res.render('auth/register', {title: 'Register', message: ''});
};




export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body as Login;
        const user = await prisma.user.findUnique({
            where: {
                username: body.username
            }
        })
        if(!user){
            errorResponse(res, 401).render('auth/login', {title: 'Login', message: 'Invalid credentials.'});
            return;
        }
        const isMatch = await bcrypt.compare(body.password, user.password);
        if(!isMatch){
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
       successResponse(res, 200).redirect('/users/dashboard');

    }

    


export const refresh = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { refreshToken } = req.cookies;
      if(!refreshToken){
          errorResponse(res, 401).render('errors/500', {title: 'Login', message: 'unauthorized'});
      }
        const decoded =  verifyRefreshToken(refreshToken) as { id: string, username: string };
        const session = await prisma.session.findUnique({ where: { token: refreshToken } });
        if (!session) {
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

         successResponse(res, 200).json({ accessToken });
        
}


export const RegisterUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const body = req.body as Register;
    const existingUser = await prisma.user.findUnique({
      where: {
        username: body.username
      }
    })
    if(existingUser){
        errorResponse(res, 409).render('auth/register', {title: 'Register', message: 'User already exists. Please login.'});
        return;
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword
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
    successResponse(res, 201).redirect('/users/dashboard');
}

export const logout = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { refreshToken, accessToken } = req.cookies;
    if(!refreshToken || !accessToken){
        errorResponse(res, 401).render('users/dashboard', {title: 'Login', message: 'unauthorized'});
    }
    const token = await prisma.session.findUnique({ where: { token: refreshToken } });
    if (!token) {
        res.status(403).render("users/dashboard", { message: "Invalid refresh token" }) 
        return
    };
    await prisma.session.delete({ where: { token: refreshToken } });
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    successResponse(res, 200).redirect('/auth/login');
}