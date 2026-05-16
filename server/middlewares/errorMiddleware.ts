import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appErrors';
import { logger } from '../shared/logger'; 

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    if (statusCode >= 500) {
        logger.error({
            err,
            method: req.method,
            url: req.url,
            ip: req.ip,
        }, `[CRITICAL SYSTEM ERROR] ${err.message}`);
    } else {
        logger.warn({
            method: req.method,
            url: req.url,
            statusCode,
        }, `[CLIENT API WARNING] ${message}`);
    }

    return res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    });
};