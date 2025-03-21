import { Response } from "express";

export function errorResponse(res: Response, status: number,) {
    return res.status(status);
}

export function successResponse(res: Response, status: number) {
    return res.status(status)
}