import { OrderByEnum } from 'src/common';

export class UserOrderByDto {
	name?: OrderByEnum;
	role?: {
		name?: OrderByEnum;
	};
	gender?: OrderByEnum;
	email?: OrderByEnum;
	dateOfBirth?: OrderByEnum;
	balance?: OrderByEnum;
	point?: OrderByEnum;
	createAt?: OrderByEnum;
	updateAt?: OrderByEnum;
	deletedAt?: OrderByEnum;
	status?: OrderByEnum;
}
