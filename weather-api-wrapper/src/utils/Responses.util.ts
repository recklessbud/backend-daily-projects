import { Request, Response, NextFunction } from "express";


export const sucessResponse = ( res: Response, statusCode: number, message: string) => {
    return res.status(statusCode).json(message);
}

export const errorResponse = ( res: Response, statusCode: number, message: string) => {
    return res.status(statusCode).json(message);
}