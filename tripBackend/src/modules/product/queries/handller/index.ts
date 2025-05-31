import { GetDiscountsByProductIdHandler } from './getDiscountsByProductId.handler';
import { GetProductByProductIdHandler } from './getProductByProductId.handler';
import { GetProductRatesByProductIdHandler } from './getProductRatesByProductId.handler';
import { GetProductsHandler } from './getProducts.handler';
import { GetProductsManagementHandler } from './getProductsManagement.handler';

export const ProductQueryHandlers = [
	GetDiscountsByProductIdHandler,
	GetProductByProductIdHandler,
	GetProductRatesByProductIdHandler,
	GetProductsHandler,
	GetProductsManagementHandler,
];
