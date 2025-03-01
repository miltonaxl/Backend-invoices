import { Router, Request, Response, NextFunction } from 'express';
import { InvoicesService } from './service';
import { validate } from '../shared/middlewares/validate';
import { createInvoiceSchema, invoiceIdSchema } from './validations/invoice';

const router = Router();
const invoicesService = new InvoicesService();

router.post('/', validate(createInvoiceSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invoice = await invoicesService.createInvoice(req.body.clientId, req.body.items);
        res.status(201).json(invoice);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', validate(invoiceIdSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invoice = await invoicesService.getInvoiceById(Number(req.params.id));
        if (!invoice) {
            res.status(404).json({ message: 'Invoice not found' });
            return;
        }
        res.json(invoice);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invoices = await invoicesService.getAllInvoices();
        res.json(invoices);
    } catch (error) {
        next(error);
    }
});

export default router;
