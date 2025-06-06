import { BillStatusEnum } from '@prisma/client';
import { UserEntity } from 'src/models';
import { GetUsersResponseDto } from 'src/modules/user/dtos';

export class GetUsersByProductScheduleIdResponseDto extends GetUsersResponseDto {
	quantity: number;
	billStatus: BillStatusEnum;

	constructor(user: UserEntity) {
		super(user);
		this.quantity = user.bill?.reduce((total, bill) => {
			return (
				total +
				bill.infoBill.reduce((sum, infoBill) => sum + infoBill.quantity, 0)
			);
		}, 0);
		this.billStatus = user.bill?.[0]?.status || BillStatusEnum.pending;
	}
}
