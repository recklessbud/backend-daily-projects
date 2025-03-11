import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logs.utils";
import { errorResponse } from "../utils/responses.utils";

interface CustomError extends Error {
  status?: number;
  code?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction ) => {
  // Default error status
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Enhanced error logging
  logger.error('Error occurred', {
    ip: req.ip,
    method: req.method,
    path: req.path,
    errorDetails: {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });

  // Handle specific error types
  switch (err.name) {
    case 'ValidationError':
      return errorResponse(res, 400).json({
        status: 'error',
        message: 'Validation Error',
        details: err.message
      });

    case 'UnauthorizedError':
      return errorResponse(res, 401).json({
        status: 'error',
        message: 'Authentication Error',
        details: err.message
      });

    case 'ForbiddenError':
      return errorResponse(res, 403).json({
        status: 'error',
        message: 'Forbidden',
        details: err.message
      });

    default:
      return errorResponse(res, status).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production' 
          ? 'Internal Server Error' 
          : message
      });
  }
};