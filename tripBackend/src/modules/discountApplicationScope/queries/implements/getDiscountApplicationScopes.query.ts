import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';

import { DiscountApplicationScopeFilterRequestDto } from '../../dtos';

export class GetDiscountApplicationScopesQuery implements IQuery {
	constructor(
		public readonly pagination: PaginationDto,
		public readonly filter?: DiscountApplicationScopeFilterRequestDto,
	) {}
}
