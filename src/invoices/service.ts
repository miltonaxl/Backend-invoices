import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { Invoice } from "./entity";
import { InvoiceItem } from "./item.entity";
import { Client } from "../clients/entity";
import { Product } from "../products/entity";
import { BadRequestError, NotFoundError } from "../shared/errors";

export class InvoicesService {
    private readonly invoiceRepository: Repository<Invoice>;
    private readonly invoiceItemRepository: Repository<InvoiceItem>;
    private readonly clientRepository: Repository<Client>;
    private readonly productRepository: Repository<Product>;

    constructor() {
        this.invoiceRepository = AppDataSource.getRepository(Invoice);
        this.invoiceItemRepository = AppDataSource.getRepository(InvoiceItem);
        this.clientRepository = AppDataSource.getRepository(Client);
        this.productRepository = AppDataSource.getRepository(Product);
    }

    async createInvoice(
        clientId: number,
        items: { productId: number; quantity: number }[]
    ): Promise<Invoice> {
        return await AppDataSource.transaction(async (manager: EntityManager) => {
            const client = await manager.getRepository(Client).findOne({ where: { id: clientId } });
            if (!client) throw new NotFoundError('Client not found');

            let total = 0;
            const invoiceItems: InvoiceItem[] = [];

            for (const item of items) {
                const product = await manager.getRepository(Product).findOne({ where: { id: item.productId } });
                if (!product) throw new NotFoundError(`Product with ID ${item.productId} not found`);

                const invoiceItem = manager.getRepository(InvoiceItem).create({
                    product,
                    quantity: item.quantity,
                    price: product.price * item.quantity,
                });

                invoiceItems.push(invoiceItem);
                total += invoiceItem.price;
            }

            const invoice = manager.getRepository(Invoice).create({
                client,
                total,
                items: invoiceItems,
            });
            const savedInvoice = await manager.getRepository(Invoice).save(invoice);

            try {
                await this.sendInvoiceToDIAN(savedInvoice);
            } catch (error) {
                if (error instanceof Error) {
                    console.error('❌ DIAN service failed:', error.message);
                } else {
                    console.error('❌ DIAN service failed:', error);
                }
                throw new BadRequestError('Failed to send invoice to DIAN');
            }

            return savedInvoice;
        });
    }

    async getInvoiceById(id: number): Promise<Invoice | null> {
        return this.invoiceRepository.findOne({
            where: { id },
            relations: ["client", "items", "items.product"],
        });
    }

    async getAllInvoices(): Promise<Invoice[]> {
        return this.invoiceRepository.find({
            relations: ["client", "items", "items.product"],
        });
    }


    private async sendInvoiceToDIAN(invoice: Invoice): Promise<void> {
        console.log('📡 Sending invoice to DIAN...');

        if (Math.random() < 0.3) {
            throw new BadRequestError('DIAN service unavailable');
        }

        console.log('✅ DIAN accepted the invoice');
    }
}
