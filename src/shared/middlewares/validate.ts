/**
 * Validate middleware
 *  - This middleware is used to validate the request body against a schema.
 *  - If the request body does not match the schema, it will return a 400 response with the errors.
 *  - If the request body matches the schema, it will call the next middleware in the chain.
 * 
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';


export const validate = (schema: ZodSchema, source: 'body' | 'params' = 'body') =>
    (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(source === 'body' ? req.body : req.params);
        if (!result.success) {
            res.status(400).json({ errors: result.error.errors });
            return;
        }
        next();
    };