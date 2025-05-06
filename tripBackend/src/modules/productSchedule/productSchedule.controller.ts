import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { HttpResponseBodyDto } from 'src/common';
import { ProductScheduleEntity } from 'src/models';

import { GetProductScheduleByProductScheduleIdRequestDto } from './dtos';
import { GetProductScheduleByProductScheduleIdQuery } from './queries/implements';

@Controller('schedule')
export class ProductScheduleController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get(':productScheduleId')
	async getProductScheduleByProductScheduleId(
		@Param('productScheduleId') productScheduleId: string,
		@Query() filter?: GetProductScheduleByProductScheduleIdRequestDto,
	): Promise<HttpResponseBodyDto<ProductScheduleEntity>> {
		return this.queryBus.execute(
			new GetProductScheduleByProductScheduleIdQuery(productScheduleId, filter),
		);
	}
}
