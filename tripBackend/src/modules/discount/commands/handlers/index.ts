import { AssignProductSchedulesToDiscountHandler } from './assignProductSchedulesToDiscount.handler';
import { CreateDiscountHandler } from './createDiscount.handler';
import { DeleteDiscountByDiscountIdHandler } from './deleteDiscountByDiscountId.handler';

export const DiscountCommandHandlers = [
	AssignProductSchedulesToDiscountHandler,
	CreateDiscountHandler,
	DeleteDiscountByDiscountIdHandler,
];
