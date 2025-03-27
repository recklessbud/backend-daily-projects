import { Request, Response, NextFunction } from "express";
import {successResponse , errorResponse} from '../utils/responses.util'
import { prismaDb } from "../lib/intializePrisma";
// import prisma from "../config/database.config

export const homePage = (req: Request, res: Response, next: NextFunction) => {
    return successResponse(res, 200).render('index');
 
}

export const postToDb = async(req: Request, res: Response, next: NextFunction) => {
    const { name, food } = req.body;
    try {
    const prisma = await prismaDb();
     if(!name){
      errorResponse(res, 400).json({ error: 'Name is required' });
     }
      const create = await prisma.url.create({
        data:{
            originalUrl:name,
            food: food
        }
      })
      successResponse(res, 201).json({message:'Url added to database', data:create});
    } catch (error) {
        console.error(error)
        errorResponse(res, 500).json({ error: 'Internal Server Error' });
    }
}