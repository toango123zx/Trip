import { OrderByEnum } from 'src/common';

export class BillOrderByDto {
	id: OrderByEnum;
	userId: OrderByEnum;
	paymentMethod: OrderByEnum;
	createdAt: OrderByEnum;
	updatedAt: OrderByEnum;
	deletedAt: OrderByEnum;
	reductionPrice: OrderByEnum;
	totalPrice: OrderByEnum;
	status: OrderByEnum;
}
