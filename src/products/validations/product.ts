import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters long')
        .max(100, 'Name must be at most 100 characters long'),
    price: z.number()
        .positive('Price must be greater than zero')
        .max(999999.99, 'Price must be less than 999999.99'),
});

export const updateProductSchema = createProductSchema.partial();

export const productIdSchema = z.object({
    id: z.string()
        .refine((value) => !isNaN(Number(value)), {
            message: 'Client ID must be a number',
        }),
});
