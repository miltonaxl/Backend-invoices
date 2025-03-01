import { Router } from 'express';
import { ClientsService } from './service';
import { validate } from '../shared/middlewares/validate';
import { createClientSchema, updateClientSchema, clientIdSchema } from './validations/client';

const router = Router();
const clientsService = new ClientsService();

router.post('/', validate(createClientSchema), async (req, res, next) => {
    try {
        const client = await clientsService.createClient(req.body);
        res.status(201).json(client);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', validate(clientIdSchema, 'params'), validate(updateClientSchema), async (req, res, next) => {
    try {
        const updatedClient = await clientsService.updateClient(Number(req.params.id), req.body);
        if (!updatedClient) { res.status(404).json({ message: 'Client not found' }); return; }
        res.json(updatedClient);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', validate(clientIdSchema, 'params'), async (req, res, next) => {
    try {
        const client = await clientsService.getClientById(Number(req.params.id));
        if (!client) { res.status(404).json({ message: 'Client not found' }); return; };
        res.json(client);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', validate(clientIdSchema, 'params'), async (req, res, next) => {
    try {
        const deleted = await clientsService.deleteClient(Number(req.params.id));
        if (!deleted) { res.status(404).json({ message: 'Client not found' }); return; }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
