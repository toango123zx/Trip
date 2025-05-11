import { GetDiscountByDiscountIdHandler } from './getDiscountByDiscountId.handler';
import { GetDiscountsByUserIdHandler } from './getDiscountsByUserId.handler';

export const DiscountQueryHandlers = [
	GetDiscountByDiscountIdHandler,
	GetDiscountsByUserIdHandler,
];
