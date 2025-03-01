import { AppDataSource } from '../config/database';
import { Product } from './entity';

export class ProductsService {
    private readonly productRepository = AppDataSource.getRepository(Product);

    async getAllProducts() {
        return this.productRepository.find();
    }

    async getProductById(id: number) {
        return this.productRepository.findOne({ where: { id } });
    }

    async createProduct(data: Partial<Product>) {
        const newProduct = this.productRepository.create(data);
        return this.productRepository.save(newProduct);
    }

    async updateProduct(id: number, data: Partial<Product>) {
        await this.productRepository.update(id, data);
        return this.getProductById(id);
    }

    async deleteProduct(id: number) {
        const result = await this.productRepository.delete(id);
        return result.affected !== 0;
    }
}