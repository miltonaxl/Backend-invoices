import { z } from 'zod';

export const createClientSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters long')
        .max(100, 'Name must be at most 100 characters long'),
    email: z.string()
        .email('Invalid email format')
        .max(100, 'Email must be at most 100 characters long'),
});

export const updateClientSchema = createClientSchema.partial();

export const clientIdSchema = z.object({
    id: z.number()
        .int('Client ID must be an integer')
        .positive('Client ID must be a positive integer'),
});
