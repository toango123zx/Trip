import { CreateDiscountHandler } from './createDiscount.handler';
import { DeleteDiscountByDiscountIdHandler } from './deleteDiscountByDiscountId.handler';

export const DiscountCommandHandlers = [
	CreateDiscountHandler,
	DeleteDiscountByDiscountIdHandler,
];
