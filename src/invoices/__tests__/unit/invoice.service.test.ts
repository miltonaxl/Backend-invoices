import { InvoicesService } from '../../service';
import { Invoice } from '../../entity';
import { InvoiceItem } from '../../item.entity';
import { Client } from '../../../clients/entity';
import { Product } from '../../../products/entity';
import { Repository, EntityManager } from 'typeorm';
import { NotFoundError, BadRequestError } from '../../../shared/errors';
import { AppDataSource } from '../../../config/database';

const mockInvoiceRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
};

const mockInvoiceItemRepository = {
    save: jest.fn(),
    create: jest.fn(),
};

const mockClientRepository = {
    findOne: jest.fn(),
};

const mockProductRepository = {
    findOne: jest.fn(),
};

jest.spyOn(AppDataSource, 'getRepository').mockImplementation((entity) => {
    if (entity === Invoice) return mockInvoiceRepository as unknown as Repository<Invoice>;
    if (entity === InvoiceItem) return mockInvoiceItemRepository as unknown as Repository<InvoiceItem>;
    if (entity === Client) return mockClientRepository as unknown as Repository<Client>;
    if (entity === Product) return mockProductRepository as unknown as Repository<Product>;
    return {} as Repository<any>;
});

jest.spyOn(AppDataSource, 'transaction').mockImplementation(async (isolationLevelOrCallback, maybeCallback) => {
    const callback = typeof isolationLevelOrCallback === 'function' ? isolationLevelOrCallback : maybeCallback;
    const mockEntityManager = {
        getRepository: (entity: any) => {
            if (entity === Invoice) return mockInvoiceRepository as unknown as Repository<Invoice>;
            if (entity === InvoiceItem) return mockInvoiceItemRepository as unknown as Repository<InvoiceItem>;
            if (entity === Client) return mockClientRepository as unknown as Repository<Client>;
            if (entity === Product) return mockProductRepository as unknown as Repository<Product>;
            return {} as Repository<any>;
        },
    } as EntityManager;
    return callback(mockEntityManager);
});

describe('InvoicesService', () => {
    let invoicesService: InvoicesService;

    beforeEach(() => {
        invoicesService = new InvoicesService();
        jest.clearAllMocks();
    });

    it('should create an invoice successfully', async () => {
        const invoiceData = { clientId: 1, items: [{ productId: 1, quantity: 2 }] };
        const client = { id: 1, name: 'Test Client', email: 'test@example.com' };
        const product = { id: 1, name: 'Product 1', price: 50 };

        mockClientRepository.findOne.mockResolvedValue(client);
        mockProductRepository.findOne.mockResolvedValue(product);
        mockInvoiceItemRepository.create.mockImplementation((data) => data);
        mockInvoiceItemRepository.save.mockResolvedValue(invoiceData.items);
        mockInvoiceRepository.create.mockImplementation((data) => ({ id: 1, ...data }));
        mockInvoiceRepository.save.mockResolvedValue({ id: 1, client, total: 100 });

        const result = await invoicesService.createInvoice(invoiceData.clientId, invoiceData.items);

        expect(mockInvoiceRepository.create).toHaveBeenCalled();
        expect(mockInvoiceRepository.save).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({ id: 1, client, total: 100 }));
    });

    it('should fail if client does not exist', async () => {
        mockClientRepository.findOne.mockResolvedValue(null);

        await expect(invoicesService.createInvoice(1, [{ productId: 1, quantity: 2 }])).rejects.toThrow(NotFoundError);
    });

    it('should fail if a product does not exist', async () => {
        const client = { id: 1, name: 'Test Client' };
        mockClientRepository.findOne.mockResolvedValue(client);
        mockProductRepository.findOne.mockResolvedValue(null);

        await expect(invoicesService.createInvoice(1, [{ productId: 99, quantity: 2 }])).rejects.toThrow(NotFoundError);
    });

    it('should fail when DIAN service rejects the invoice', async () => {
        jest.spyOn(invoicesService as any, 'sendInvoiceToDIAN').mockRejectedValue(new BadRequestError('DIAN service unavailable'));

        const client = { id: 1, name: 'Test Client' };
        const product = { id: 1, name: 'Product 1', price: 50 };

        mockClientRepository.findOne.mockResolvedValue(client);
        mockProductRepository.findOne.mockResolvedValue(product);
        mockInvoiceItemRepository.create.mockImplementation((data) => data);
        mockInvoiceItemRepository.save.mockResolvedValue([]);
        mockInvoiceRepository.create.mockImplementation((data) => ({ id: 1, ...data }));
        mockInvoiceRepository.save.mockResolvedValue({ id: 1, client, total: 100 });

        await expect(invoicesService.createInvoice(1, [{ productId: 1, quantity: 2 }])).rejects.toThrow(BadRequestError);
    });

    it('should fetch all invoices', async () => {
        const invoices = [{ id: 1, client: { id: 1 }, total: 100 }];
        mockInvoiceRepository.find.mockResolvedValue(invoices);

        const result = await invoicesService.getAllInvoices();

        expect(mockInvoiceRepository.find).toHaveBeenCalled();
        expect(result).toEqual(invoices);
    });

    it('should fetch an invoice by ID', async () => {
        const invoice = { id: 1, client: { id: 1 }, total: 100 };
        mockInvoiceRepository.findOne.mockResolvedValue(invoice);

        const result = await invoicesService.getInvoiceById(1);

        expect(mockInvoiceRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['client', 'items', 'items.product'] });
        expect(result).toEqual(invoice);
    });

    it('should throw an error if invoice is not found', async () => {
        mockInvoiceRepository.findOne.mockResolvedValue(null);

        await expect(invoicesService.getInvoiceById(1)).rejects.toThrow(NotFoundError);
    });
});
