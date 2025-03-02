import request from 'supertest';
import app from '../../../app';
import { AppDataSource } from '../../../config/database';
import { Client } from '../../entity'



const createClientMock = async () => {
    const clientRepository = AppDataSource.getRepository(Client);

    const newClient = clientRepository.create({
        name: 'Test Client',
        email: 'test@example.com',
    });

    const savedClient = await clientRepository.save(newClient);

    return savedClient.id;
};

describe('Clients E2E Tests', () => {
    let clientId: number;

    it('should create a client', async () => {
        const response = await request(app).post('/api/clients').send({
            name: 'Test Client',
            email: 'test@creation.com',
        });

        console.log("******************* response.body *******************");

        console.log(response.body);

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('Test Client');

        clientId = response.body.id;
    });

    it('should fetch a client by ID', async () => {

        clientId = await createClientMock();
        const response = await request(app).get(`/api/clients/${clientId}`);



        expect(response.status).toBe(200);
        expect(response.body.id).toBe(clientId);
    });

    it('should return 404 when fetching a non-existent client', async () => {
        const response = await request(app).get('/api/clients/9999');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Client not found');
    });

    it('should update a client', async () => {
        clientId = await createClientMock();
        const response = await request(app).put(`/api/clients/${clientId}`).send({
            name: 'Updated Client',
            email: 'updated@example.com',
        });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Client');
    });

    it('should return 404 when updating a non-existent client', async () => {
        const response = await request(app).put('/clients/9999').send({
            name: 'Does Not Exist',
            email: 'doesnotexist@example.com',
        });

        expect(response.status).toBe(404);
    });

    it('should delete a client', async () => {


        clientId = await createClientMock();

        const response = await request(app).delete(`/api/clients/${clientId}`);
        expect(response.status).toBe(204);
    });

    it('should return 404 when deleting a non-existent client', async () => {
        const response = await request(app).delete('/api/clients/9999');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Client not found');
    });
});