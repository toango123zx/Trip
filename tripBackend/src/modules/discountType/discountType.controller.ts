import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { HttpResponseBodyDto, PaginationDto } from 'src/common';
import { DiscountTypeEntity } from 'src/models';

import { DiscountTypeFilterRequestDto } from './dtos';
import { GetDiscountTypesQuery } from './queries/implements';

@Controller('discount-type')
export class DiscountTypeController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get()
	async getDiscountTypes(
		@Query() pagination: PaginationDto,
		@Query() search?: DiscountTypeFilterRequestDto,
	): Promise<HttpResponseBodyDto<DiscountTypeEntity[]>> {
		return this.queryBus.execute(new GetDiscountTypesQuery(pagination, search));
	}
}
