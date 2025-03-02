import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof HttpError) {
        res.status(err.status).json({ error: err.message });
        return;
    }

    res.status(500).json({ error: 'Internal Server Error' });
};