import request from 'supertest';
import app from '../../../app';
import { AppDataSource } from '../../../config/database';
import { Product } from '../../entity';

const createProductMock = async () => {
    const productRepository = AppDataSource.getRepository(Product);
    const newProduct = productRepository.create({
        name: `Test Product ${Date.now()}`,
        price: 100.0,
    });
    return await productRepository.save(newProduct);
};

describe('Products E2E Tests', () => {
    let productId: number;

    it('should create a product', async () => {
        const response = await request(app).post('/api/products').send({
            name: 'Test Product',
            price: 50.0,
        });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('Test Product');

        productId = response.body.id;
    });

    it('should fetch a product by ID', async () => {
        productId = (await createProductMock()).id;
        const response = await request(app).get(`/api/products/${productId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(productId);
    });

    it('should return 404 when fetching a non-existent product', async () => {
        const response = await request(app).get('/api/products/9999');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Product not found');
    });

    it('should update a product', async () => {
        productId = (await createProductMock()).id;
        const response = await request(app).put(`/api/products/${productId}`).send({
            name: 'Updated Product',
            price: 120.0,
        });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Product');
    });

    it('should return 404 when updating a non-existent product', async () => {
        const response = await request(app).put('/api/products/9999').send({
            name: 'Non-existent Product',
            price: 200.0,
        });

        expect(response.status).toBe(404);
    });

    it('should delete a product', async () => {
        productId = (await createProductMock()).id;
        const response = await request(app).delete(`/api/products/${productId}`);

        expect(response.status).toBe(204);
    });

    it('should return 404 when deleting a non-existent product', async () => {
        const response = await request(app).delete('/api/products/9999');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Product not found');
    });
});
