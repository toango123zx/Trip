import { GetDiscountsByProductIdHandler } from './getDiscountsByProductId.handler';
import { GetProductByProductIdHandler } from './getProductByProductId.handler';
import { GetProductsHandler } from './getProducts.handler';
import { GetProductsManagementHandler } from './getProductsManagement.handler';

export const ProductQueryHandlers = [
	GetDiscountsByProductIdHandler,
	GetProductsHandler,
	GetProductByProductIdHandler,
	GetProductsManagementHandler,
];
