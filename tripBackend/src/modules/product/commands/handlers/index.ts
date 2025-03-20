import { CreateProductHandler } from './createProduct.handler';
import { CreateProductScheduleByProductIdHandler } from './createProductScheduleByProductid.handler';

export const ProductCommandHandlers = [
	CreateProductHandler,
	CreateProductScheduleByProductIdHandler,
];
