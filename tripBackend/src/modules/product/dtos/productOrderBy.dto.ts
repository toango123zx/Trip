import { OrderByEnum } from 'src/common';

import { ProductFilterRequestDto } from './requests';

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
		country?: OrderByEnum;
	};
	productCategory?: {
		name?: OrderByEnum;
	};
	createAt?: OrderByEnum;
	updateAt?: OrderByEnum;
	deletedAt?: OrderByEnum;
	status?: OrderByEnum;

	constructor(productFilter: Partial<ProductFilterRequestDto>) {
		Object.assign(this, productFilter);
		if (productFilter.city) {
			this.location.country = productFilter.city;
		}
	}
}
