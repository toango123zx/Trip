import { OrderByEnum } from 'src/common';

export class LocationOrderByDto {
	systemName?: OrderByEnum;
	displayName?: OrderByEnum;
	country?: OrderByEnum;
	mapAddressId?: OrderByEnum;
	createAt?: OrderByEnum;
	updateAt?: OrderByEnum;
	deletedAt?: OrderByEnum;
	status?: OrderByEnum;
}
