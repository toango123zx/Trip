import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { HttpResponseBodyDto, PaginationDto } from 'src/common';
import { DiscountEligibilityEntity } from 'src/models';

import { DiscountEligibilityFilterRequestDto } from './dtos';
import { GetDiscountEligibilitiesQuery } from './queries/implements';

@Controller('discount-eligibility')
export class DiscountEligibilityController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get()
	async getDiscountEligibilities(
		@Query() pagination: PaginationDto,
		@Query() search?: DiscountEligibilityFilterRequestDto,
	): Promise<HttpResponseBodyDto<DiscountEligibilityEntity[]>> {
		return this.queryBus.execute(
			new GetDiscountEligibilitiesQuery(pagination, search),
		);
	}
}
