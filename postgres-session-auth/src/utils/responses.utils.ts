import { Response } from "express";


export const errorResponse = (res: Response, status: number) => res.status(status);

export const successResponse = (res: Response, status: number) => res.status(status);