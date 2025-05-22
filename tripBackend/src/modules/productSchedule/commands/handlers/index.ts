import { AddToCartByProductScheduleIdHandler } from './addToCartByProductScheduleId.handler';
import { DeleteProductScheduleByProductScheduleIdHandler } from './deleteProductScheduleByProductScheduleId.handler';

export const productScheduleCommandHandlers = [
	AddToCartByProductScheduleIdHandler,
	DeleteProductScheduleByProductScheduleIdHandler,
];
