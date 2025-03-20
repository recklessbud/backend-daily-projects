import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responses.util";


export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err.message);
  if (err instanceof SyntaxError && 'body' in err) {
    errorResponse(res, 400).json({ error: 'Invalid JSON' });
     return
  }
  next();
}
