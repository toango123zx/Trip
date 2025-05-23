import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';
import { UserInformationDto } from 'src/modules/user/dtos';

import { BillFilterRequestDto } from '../../dtos/requests/billFilter.request';

export class GetBillsByUserIdQuery implements IQuery {
	constructor(
		public readonly pagination: PaginationDto,
		public readonly myInformation: UserInformationDto,
		public readonly filter: BillFilterRequestDto,
	) {}
}
