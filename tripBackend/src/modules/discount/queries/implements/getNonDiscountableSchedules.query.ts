import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';
import { ProductScheduleFilterRequestDto } from 'src/modules/productSchedule/dtos';
import { UserInformationDto } from 'src/modules/user/dtos';

export class GetNonDiscountableSchedulesQuery implements IQuery {
	constructor(
		public readonly discountId: string,
		public readonly productId: string,
		public readonly pagination: PaginationDto,
		public readonly myInformation: UserInformationDto,
		public readonly filter: ProductScheduleFilterRequestDto,
	) {}
}
