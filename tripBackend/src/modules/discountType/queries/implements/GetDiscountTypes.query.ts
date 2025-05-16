import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';

import { DiscountTypeFilterRequestDto } from '../../dtos';

export class GetDiscountTypesQuery implements IQuery {
	constructor(
		public readonly pagination: PaginationDto,
		public readonly filter?: DiscountTypeFilterRequestDto,
	) {}
}
