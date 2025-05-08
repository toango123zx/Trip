import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { HttpResponseBodyDto, PaginationDto } from 'src/common';

import { DiscountFilterRequestDto, GetDiscountsByProductIdResponseDto } from './dtos';
import { GetDiscountsByProductIdQuery } from './queries/implements';

@Controller('discount')
export class DiscountController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('/:productId')
	async getDiscountsByProductId(
		@Param('productId') productId: string,
		@Query() pagination: PaginationDto,
		@Query() search?: DiscountFilterRequestDto,
	): Promise<HttpResponseBodyDto<GetDiscountsByProductIdResponseDto[]>> {
		return this.queryBus.execute(
			new GetDiscountsByProductIdQuery(productId, pagination, search),
		);
	}
}
