import request from 'supertest';
import app from '../../../app';
import { AppDataSource } from '../../../config/database';
import { Invoice } from '../../entity';
import { Client } from '../../../clients/entity';
import { Product } from '../../../products/entity';;

const createClientMock = async () => {
    const clientRepository = AppDataSource.getRepository(Client);
    const newClient = clientRepository.create({ name: 'Test Client', email: `test${Date.now()}@example.com` });
    const savedClient = await clientRepository.save(newClient);
    return savedClient.id;
};

const createProductMock = async () => {
    const productRepository = AppDataSource.getRepository(Product);
    const newProduct = productRepository.create({ name: 'Test Product', price: 50.0 });
    const savedProduct = await productRepository.save(newProduct);
    return savedProduct.id;
};

const createInvoiceMock = async (clientId: number, productId: number) => {
    const invoiceRepository = AppDataSource.getRepository(Invoice);
    const newInvoice = invoiceRepository.create({
        client: { id: clientId },
        total: 100,
        items: [{ product: { id: productId }, quantity: 2, price: 50 }],
    });

    const savedInvoice = await invoiceRepository.save(newInvoice);
    return savedInvoice.id;
};

describe('Invoices E2E Tests', () => {

    it('should create an invoice', async () => {
        const clientId = await createClientMock();
        const productId = await createProductMock();
        const response = await request(app).post('/api/invoices').send({
            clientId,
            items: [{ productId, quantity: 2 }],
        });

        if (response.status !== 201) {

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('DIAN service unavailable');
        }


        expect(response.status).toBe(201);
        expect(response.body.client.id).toBe(clientId);
        expect(response.body.total).toBe(100);
    });

    it('should fetch an invoice by ID', async () => {
        const clientId = await createClientMock();
        const productId = await createProductMock();

        const invoiceId = await createInvoiceMock(clientId, productId);
        const response = await request(app).get(`/api/invoices/${invoiceId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(invoiceId);
    });

    it('should return 404 when fetching a non-existent invoice', async () => {
        const response = await request(app).get('/api/invoices/9999');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Invoice not found');
    });
});
