import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';

import { DiscountFilterRequestDto } from '../../dtos';

export class GetDiscountsQuery implements IQuery {
	constructor(
		public readonly pagination: PaginationDto,
		public readonly filter: DiscountFilterRequestDto,
	) {}
}
