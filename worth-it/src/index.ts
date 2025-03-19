import serverless from 'serverless-http';
import app from './app';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            startTime: number;
        }
    }
}

// Global timeout configuration
const LAMBDA_TIMEOUT = 28000; // 28 seconds
const SCRAPING_TIMEOUT = 25000; // 25 seconds

// Add timeout handling middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    // Set timeout to slightly less than Lambda timeout
    req.setTimeout(LAMBDA_TIMEOUT);
    res.setTimeout(LAMBDA_TIMEOUT);
    
    // Track request start time
    req.startTime = Date.now();
    
    // Add timeout listener
    res.on('timeout', () => {
        const error = new Error('Request timeout');
        (error as NodeJS.ErrnoException).code = 'ETIMEDOUT';
        next(error);
    });
    
    next();
});

// Add error handling for timeouts
// ...existing code...
app.use(((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error.code === 'ETIMEDOUT') {
        console.error(`Request timed out after ${Date.now() - req.startTime}ms`);
        return res.status(504).json({
            error: 'Request timeout',
            success: false,
            timeElapsed: `${Date.now() - req.startTime}ms`
        });
    }
    next(error);
}) as ErrorRequestHandler);;

// Add final error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal Server Error',
        success: false,
        message: error.message
    });
});

export const handler = serverless(app, {
    request: {
        timeout: LAMBDA_TIMEOUT
    }
});