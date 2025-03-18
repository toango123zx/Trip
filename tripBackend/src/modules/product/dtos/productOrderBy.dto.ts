import { OrderByEnum } from 'src/common';

export class ProductOrderByDto {
	name?: OrderByEnum;
	time?: OrderByEnum;
	quantityAvailable?: OrderByEnum;
	age?: OrderByEnum;
	quantityCompleted?: OrderByEnum;
	quantityRate?: OrderByEnum;
	avgRate?: OrderByEnum;
	location?: {
		displayName?: OrderByEnum;
		city?: OrderByEnum;
	};
	productCategory?: {
		name?: OrderByEnum;
	};
	createAt?: OrderByEnum;
	updateAt?: OrderByEnum;
	deletedAt?: OrderByEnum;
	status?: OrderByEnum;
}
