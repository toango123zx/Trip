import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';

import { BillFilterRequestDto } from '../../dtos/requests/billFilter.request';

export class GetBillsManagementQuery implements IQuery {
	constructor(
		public readonly pagination: PaginationDto,
		public readonly filter: BillFilterRequestDto,
	) {}
}
