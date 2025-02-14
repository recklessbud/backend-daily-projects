import type { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = <T>(schema: ZodSchema<T>) => (req: Request, res: Response, next: NextFunction)=>{
    const results = schema.safeParse(req.body);
    if(!results.success){
        res.status(400).json({
            success: false,
            errors: results.error.errors	
        });
        return Promise.resolve();
    }
    next();
}