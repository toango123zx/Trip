import { GetDiscountByDiscountIdHandler } from './getDiscountByDiscountId.handler';
import { GetDiscountsByUserIdHandler } from './getDiscountsByUserId.handler';
import { GetNonDiscountableSchedulesHandler } from './getNonDiscountableSchedules.handler';

export const DiscountQueryHandlers = [
	GetDiscountByDiscountIdHandler,
	GetDiscountsByUserIdHandler,
	GetNonDiscountableSchedulesHandler,
];
