import { Router, Request, Response, NextFunction } from 'express';
import { ProductsService } from './service';
import { validate } from '../shared/middlewares/validate';
import { createProductSchema, updateProductSchema, productIdSchema } from './validations/product';

const router = Router();
const productsService = new ProductsService();

router.post('/', validate(createProductSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productsService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', validate(productIdSchema, 'params'), validate(updateProductSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedProduct = await productsService.updateProduct(Number(req.params.id), req.body);
        if (!updatedProduct) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json(updatedProduct);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', validate(productIdSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productsService.getProductById(Number(req.params.id));
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productsService.getAllProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', validate(productIdSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await productsService.deleteProduct(Number(req.params.id));
        if (!deleted) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
