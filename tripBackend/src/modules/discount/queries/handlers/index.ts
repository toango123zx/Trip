import { GetDiscountByDiscountIdHandler } from './getDiscountByDiscountId.handler';
import { GetDiscountsHandler } from './getDiscounts.handler';
import { GetDiscountsByUserIdHandler } from './getDiscountsByUserId.handler';
import { GetNonDiscountableSchedulesHandler } from './getNonDiscountableSchedules.handler';

export const DiscountQueryHandlers = [
	GetDiscountByDiscountIdHandler,
	GetDiscountsHandler,
	GetDiscountsByUserIdHandler,
	GetNonDiscountableSchedulesHandler,
];
