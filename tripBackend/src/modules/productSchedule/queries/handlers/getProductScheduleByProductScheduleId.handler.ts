import { HttpException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';
import { ProductScheduleEntity } from 'src/models';

import { ProductScheduleRepository } from '../../productSchedule.repository';
import { GetProductScheduleByProductScheduleIdQuery } from '../implements';

@QueryHandler(GetProductScheduleByProductScheduleIdQuery)
export class GetProductScheduleByProductScheduleIdHandler
	implements IQueryHandler<GetProductScheduleByProductScheduleIdQuery>
{
	constructor(private readonly productScheduleRepository: ProductScheduleRepository) {}

	async execute(
		query: GetProductScheduleByProductScheduleIdQuery,
	): Promise<HttpResponseBodySuccessDto<ProductScheduleEntity> | HttpException> {
		const productSchedule =
			await this.productScheduleRepository.findProductScheduleByProductScheduleId(
				query.productScheduleId,
				query.filter?.status,
			);

		if (!productSchedule) {
			throw new NotFoundException('productScheduleId');
		}

		return {
			success: true,
			data: productSchedule,
		};
	}
}
