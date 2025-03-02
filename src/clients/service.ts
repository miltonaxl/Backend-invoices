import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Client } from './entity';
import { BadRequestError, NotFoundError } from '../shared/errors';

export class ClientsService {
    private readonly clientRepository: Repository<Client>;

    constructor() {
        this.clientRepository = AppDataSource.getRepository(Client);
    }

    async getAllClients(): Promise<Client[]> {
        return this.clientRepository.find();
    }

    async getClientById(id: number): Promise<Client | null> {
        const clientResponse = await this.clientRepository.findOne({ where: { id } });

        if (!clientResponse) throw new NotFoundError('Client not found');
        return clientResponse;
    }

    async createClient(data: Partial<Client>): Promise<Client> {
        const email = data.email;
        const client = await this.clientRepository.findOne({ where: { email } });
        if (client) {
            throw new BadRequestError('Email already taken');
        }


        const newClient = this.clientRepository.create(data);
        return this.clientRepository.save(newClient);
    }

    async updateClient(id: number, data: Partial<Client>): Promise<Client | null> {
        await this.clientRepository.update(id, data);
        return this.getClientById(id);
    }

    async deleteClient(id: number): Promise<boolean> {
        const clientResponse = await this.clientRepository.findOne({ where: { id } });
        if (!clientResponse) throw new NotFoundError('Client not found');


        const result = await this.clientRepository.delete(id);
        return result.affected !== 0;
    }
}
