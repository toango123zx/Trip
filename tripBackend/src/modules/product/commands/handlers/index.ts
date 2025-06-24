import { CreateProductHandler } from './createProduct.handler';
import { CreateProductRateByProductIdHandler } from './createProductRateByProductId.handler';
import { CreateProductScheduleByProductIdHandler } from './createProductScheduleByProductid.handler';
import { CreateRoomTypeByProductIdHandler } from './createRoomTypeByProductId.handler';
import { DeleteProductByProductIdHandler } from './deleteProductByProductId.handler';
import { UpdateProductInformationByProductIdHandler } from './updateProductInformationByProductId.handler';

export const ProductCommandHandlers = [
	CreateProductHandler,
	CreateProductRateByProductIdHandler,
	CreateProductScheduleByProductIdHandler,
	CreateRoomTypeByProductIdHandler,
	DeleteProductByProductIdHandler,
	UpdateProductInformationByProductIdHandler,
];
