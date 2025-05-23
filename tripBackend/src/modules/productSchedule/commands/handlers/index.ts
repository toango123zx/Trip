import { AddToCartByProductScheduleIdHandler } from './addToCartByProductScheduleId.handler';
import { DeleteProductScheduleByProductScheduleIdHandler } from './deleteProductScheduleByProductScheduleId.handler';
import { UpdateCompletedProductScheduleByProductScheduleHandler } from './updateCompletedProductScheduleByProductSchedule.handler';

export const productScheduleCommandHandlers = [
	AddToCartByProductScheduleIdHandler,
	DeleteProductScheduleByProductScheduleIdHandler,
	UpdateCompletedProductScheduleByProductScheduleHandler,
];
