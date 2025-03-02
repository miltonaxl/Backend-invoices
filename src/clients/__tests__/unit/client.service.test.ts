import { ClientsService } from '../../service';
import { Client } from '../../entity';
import { Repository } from 'typeorm';
import { BadRequestError, NotFoundError } from '../../../shared/errors';
import { AppDataSource } from '../../../config/database';

const mockClientRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
};
jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockClientRepository as unknown as Repository<Client>);

describe('ClientsService', () => {
    let clientsService: ClientsService;

    beforeEach(() => {
        clientsService = new ClientsService();
        jest.clearAllMocks();
    });

    it('should create a client', async () => {
        const clientData = { name: 'John Doe', email: 'john.doe@example.com' };
        const savedClient = { id: 1, ...clientData };

        mockClientRepository.findOne.mockResolvedValue(null);
        mockClientRepository.create.mockImplementation((data) => ({ ...data }));
        mockClientRepository.save.mockResolvedValue(savedClient);

        const result = await clientsService.createClient(clientData);

        expect(mockClientRepository.create).toHaveBeenCalledWith(clientData);
        expect(mockClientRepository.save).toHaveBeenCalledWith(clientData);
        expect(result).toEqual(savedClient);
    });

    it('should throw an error if email is already taken', async () => {
        const clientData = { name: 'John Doe', email: 'john.doe@example.com' };
        mockClientRepository.findOne.mockResolvedValue(clientData);

        await expect(clientsService.createClient(clientData)).rejects.toThrow(BadRequestError);

        expect(mockClientRepository.save).not.toHaveBeenCalled();
    });

    it('should get a client by ID', async () => {
        const client = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
        mockClientRepository.findOne.mockResolvedValue(client);

        const result = await clientsService.getClientById(1);

        expect(mockClientRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(result).toEqual(client);
    });

    it('should throw an error if client is not found', async () => {
        mockClientRepository.findOne.mockResolvedValue(null);
        await expect(clientsService.getClientById(1)).rejects.toThrow(NotFoundError);
    });

    it('should get all clients', async () => {
        const clients = [
            { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' }
        ];
        mockClientRepository.find.mockResolvedValue(clients);

        const result = await clientsService.getAllClients();

        expect(mockClientRepository.find).toHaveBeenCalled();
        expect(result).toEqual(clients);
    });

    it('should update a client', async () => {
        const existingClient = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
        const updatedClient = { id: 1, name: 'Updated Name', email: 'john.doe@example.com' };

        mockClientRepository.findOne.mockResolvedValue(existingClient);
        mockClientRepository.update.mockResolvedValue({ affected: 1 }); // ✅ Fix: Mock update()
        mockClientRepository.findOne.mockResolvedValue(updatedClient); // ✅ Return updated client

        const result = await clientsService.updateClient(1, { name: 'Updated Name' });

        expect(mockClientRepository.update).toHaveBeenCalledWith(1, { name: 'Updated Name' });
        expect(result).toEqual(updatedClient);
    });

    it('should throw an error if updating a non-existent client', async () => {
        mockClientRepository.findOne.mockResolvedValue(null);

        await expect(clientsService.updateClient(1, { name: 'Updated Name' })).rejects.toThrow(NotFoundError);
    });

    it('should delete a client', async () => {
        mockClientRepository.findOne.mockResolvedValue({ id: 1 });
        mockClientRepository.delete.mockResolvedValue({ affected: 1 });

        const result = await clientsService.deleteClient(1);

        expect(mockClientRepository.delete).toHaveBeenCalledWith(1);
        expect(result).toBe(true);
    });

    it('should throw an error if deleting a non-existent client', async () => {
        mockClientRepository.findOne.mockResolvedValue(null);
        mockClientRepository.delete.mockResolvedValue({ affected: 0 });

        await expect(clientsService.deleteClient(1)).rejects.toThrow(NotFoundError);
        expect(mockClientRepository.delete).not.toHaveBeenCalled();
    });
});
