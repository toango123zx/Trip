import { CreateProductHandler } from './createProduct.handler';
import { CreateProductScheduleByProductIdHandler } from './createProductScheduleByProductid.handler';
import { UpdateProductInformationByProductIdHandler } from './updateProductInformationByProductId.handler';

export const ProductCommandHandlers = [
	CreateProductHandler,
	CreateProductScheduleByProductIdHandler,
	UpdateProductInformationByProductIdHandler,
];
