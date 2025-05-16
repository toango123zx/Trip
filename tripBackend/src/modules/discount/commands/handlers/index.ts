import { AssignProductSchedulesToDiscountHandler } from './assignProductSchedulesToDiscount.handler';
import { CreateDiscountHandler } from './createDiscount.handler';
import { DeleteDiscountByDiscountIdHandler } from './deleteDiscountByDiscountId.handler';
import { DeleteProductSchedulesToDiscountHandler } from './deleteProductSchedulesToDiscount.handler';

export const DiscountCommandHandlers = [
	AssignProductSchedulesToDiscountHandler,
	CreateDiscountHandler,
	DeleteDiscountByDiscountIdHandler,
	DeleteProductSchedulesToDiscountHandler,
];
