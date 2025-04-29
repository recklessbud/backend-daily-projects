import { errorResponse } from "../utils/Responses.util";
import { Request, Response, NextFunction } from "express";

    
    export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    // Log the error for debugging
    console.error('Error:', err);

    // Check if error has a status code, default to 500 if not present
    const statusCode = err.statusCode || 500;
    
    // Get error message or use generic message if none provided
    const message = err.message || 'Internal Server Error';

    // Return error response using utility function
    errorResponse(res, statusCode, message);
}        
