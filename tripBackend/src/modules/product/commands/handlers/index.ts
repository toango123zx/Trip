import { CreateProductHandler } from './createProduct.handler';
import { CreateProductScheduleByProductIdHandler } from './createProductScheduleByProductid.handler';
import { DeleteProductByProductIdHandler } from './deleteProductByProductId.handler';
import { UpdateProductInformationByProductIdHandler } from './updateProductInformationByProductId.handler';

export const ProductCommandHandlers = [
	CreateProductHandler,
	CreateProductScheduleByProductIdHandler,
	UpdateProductInformationByProductIdHandler,
	DeleteProductByProductIdHandler,
];
