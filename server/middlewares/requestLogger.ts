import type { Request, Response, NextFunction } from 'express';
import { logger } from '../shared/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    logger.info({
        method: req.method,
        url: req.url,
        ip: req.ip
    }, `Incoming ${req.method} request to ${req.url}`);

    res.on('finish', () => {
        const duration = Date.now() - startTime;

        logger.info({
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            durationMs: duration
        }, `HTTP Request completed in ${duration}ms`);
    });

    next();
};