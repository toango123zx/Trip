import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { PaginationDto, HttpResponseBodyDto } from 'src/common';
import { DiscountApplicationScopeEntity } from 'src/models';

import { DiscountApplicationScopeFilterRequestDto } from './dtos';
import { GetDiscountApplicationScopesQuery } from './queries/implements';

@Controller('discount-application-scope')
export class DiscountApplicationScopeController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get()
	async getDiscountApplicationScopes(
		@Query() pagination: PaginationDto,
		@Query() search?: DiscountApplicationScopeFilterRequestDto,
	): Promise<HttpResponseBodyDto<DiscountApplicationScopeEntity[]>> {
		return this.queryBus.execute(
			new GetDiscountApplicationScopesQuery(pagination, search),
		);
	}
}
