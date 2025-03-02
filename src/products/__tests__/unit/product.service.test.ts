import { ProductsService } from '../../service';
import { Product } from '../../entity';
import { Repository } from 'typeorm';
import { NotFoundError } from '../../../shared/errors';
import { AppDataSource } from '../../../config/database';

const mockProductRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
};

jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockProductRepository as unknown as Repository<Product>);

describe('ProductsService', () => {
    let productsService: ProductsService;

    beforeEach(() => {
        productsService = new ProductsService();
        jest.clearAllMocks();
    });

    it('should create a product', async () => {
        const productData = { name: 'Laptop', price: 1200 };
        mockProductRepository.create.mockImplementation((data) => ({ ...data }));
        mockProductRepository.save.mockResolvedValue({ id: 1, ...productData });

        const result = await productsService.createProduct(productData);

        expect(result).toEqual({ id: 1, ...productData });
    });

    it('should get all products', async () => {
        const products = [{ id: 1, name: 'Laptop', price: 1200 }];
        mockProductRepository.find.mockResolvedValue(products);

        const result = await productsService.getAllProducts();

        expect(result).toEqual(products);
    });

    it('should delete a product', async () => {
        mockProductRepository.findOne.mockResolvedValue({ id: 1 });
        mockProductRepository.delete.mockResolvedValue({ affected: 1 });

        const result = await productsService.deleteProduct(1);

        expect(result).toBe(true);
    });
});
