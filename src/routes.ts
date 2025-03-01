/**
 * This file is the entry point for all routes in the application.
 * @packageDocumentation
 * @module routes
 * @preferred
 */


import { Router } from 'express';
import clientsRoutes from './clients/controller';
import productsRoutes from './products/controller';
import invoicesRoutes from './invoices/controller';

const router = Router();

router.use('/clients', clientsRoutes);
router.use('/products', productsRoutes);
router.use('/invoices', invoicesRoutes);

export default router;