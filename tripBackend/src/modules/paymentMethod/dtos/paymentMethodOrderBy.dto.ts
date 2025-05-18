import { OrderByEnum } from 'src/common';

export class PaymentMethodOrderByDto {
	name: OrderByEnum;
	createdAt: OrderByEnum;
	updatedAt: OrderByEnum;
	deleteAt: OrderByEnum;
	status: OrderByEnum;
}
