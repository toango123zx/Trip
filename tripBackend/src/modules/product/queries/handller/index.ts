import { GetDiscountsByProductIdHandler } from './getDiscountsByProductId.handler';
import { GetProductByProductIdHandler } from './getProductByProductId.handler';
import { GetProductsHandler } from './getProducts.handler';

export const ProductQueryHandlers = [
	GetDiscountsByProductIdHandler,
	GetProductsHandler,
	GetProductByProductIdHandler,
];
