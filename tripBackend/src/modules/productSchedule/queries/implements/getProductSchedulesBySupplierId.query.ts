import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';

import { ProductScheduleFilterRequestDto } from '../../dtos';

export class GetProductSchedulesBySupplierIdQuery implements IQuery {
	constructor(
		public readonly supplierId: string,
		public readonly pagination: PaginationDto,
		public readonly filter?: ProductScheduleFilterRequestDto,
	) {}
}
