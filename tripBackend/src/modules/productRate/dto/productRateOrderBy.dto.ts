import { OrderByEnum } from 'src/common';

export class ProductRateOrderByDto {
	star: OrderByEnum;
	createdAt: OrderByEnum;
	updatedAt: OrderByEnum;
	deleteAt: OrderByEnum;
	status: OrderByEnum;
}
