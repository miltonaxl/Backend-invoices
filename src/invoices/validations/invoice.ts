import { z } from 'zod';

export const createInvoiceSchema = z.object({
    clientId: z.number()
        .int('Client ID must be an integer')
        .positive('Client ID must be a positive integer'),
    items: z.array(
        z.object({
            productId: z.number()
                .int('Product ID must be an integer')
                .positive('Product ID must be a positive integer'),
            quantity: z.number()
                .int('Quantity must be an integer')
                .min(1, 'Quantity must be at least 1')
                .max(1000, 'Quantity must not exceed 1000'),
        })
    ).min(1, 'Invoice must have at least one item'),
});

export const invoiceIdSchema = z.object({
    id: z.number()
        .int('Invoice ID must be an integer')
        .positive('Invoice ID must be a positive integer'),
});
