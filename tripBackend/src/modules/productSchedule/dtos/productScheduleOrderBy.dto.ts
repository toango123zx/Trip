import { OrderByEnum } from 'src/common';

export class ProductScheduleOrderByDto {
	startTime?: OrderByEnum;
	endTime?: OrderByEnum;
	price?: OrderByEnum;
	booked?: OrderByEnum;
	productScheduleId?: OrderByEnum;
	startOrder?: OrderByEnum;
	endOrder?: OrderByEnum;
	createAt?: OrderByEnum;
	updateAt?: OrderByEnum;
	deletedAt?: OrderByEnum;
	status?: OrderByEnum;
}
