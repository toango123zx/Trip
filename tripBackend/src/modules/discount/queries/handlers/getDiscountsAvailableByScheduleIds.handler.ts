import { HttpException, HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProductScheduleStatusEnum } from '@prisma/client';
import { HttpResponseBodySuccessDto, OptionalException } from 'src/common';

import { ProductScheduleRepository } from 'src/modules/productSchedule/productSchedule.repository';

import { DiscountRepository } from '../../discount.repository';
import { GetDiscountsResponseDto } from '../../dtos';
import { GetDiscountsAvailableByScheduleIdsQuery } from '../implements';

@QueryHandler(GetDiscountsAvailableByScheduleIdsQuery)
export class GetDiscountsAvailableByScheduleIdsHandler
	implements IQueryHandler<GetDiscountsAvailableByScheduleIdsQuery>
{
	constructor(
		private readonly ProductScheduleRepository: ProductScheduleRepository,
		private readonly discountRepository: DiscountRepository,
	) {}

	async execute(
		query: GetDiscountsAvailableByScheduleIdsQuery,
	): Promise<HttpResponseBodySuccessDto<GetDiscountsResponseDto[]> | HttpException> {
		let { scheduleIds } = query;
		if (typeof scheduleIds === 'string') {
			scheduleIds = [scheduleIds];
		}
		const { keyword, statusSearch, ...discountFilter } = query.filter;
		if (new Set(scheduleIds).size !== scheduleIds.length) {
			throw new OptionalException(
				HttpStatus.UNPROCESSABLE_ENTITY,
				'Duplicate schedule IDs are not allowed',
			);
		}

		const totalRecords = (
			await this.ProductScheduleRepository.findProductSchedulesByProductSchedulesId(
				scheduleIds,
				ProductScheduleStatusEnum.active,
				true,
			)
		)[1];

		if (totalRecords !== scheduleIds.length) {
			throw new OptionalException(
				HttpStatus.CONFLICT,
				'Some schedule IDs are not available',
			);
		}

		const [discounts] = await this.discountRepository.findDiscounts(
			scheduleIds,
			keyword,
			statusSearch,
			true,
			undefined,
			discountFilter,
		);

		const discountsInformation = discounts.map(
			(discount) => new GetDiscountsResponseDto(discount),
		);

		return {
			success: true,
			data: discountsInformation,
		};
	}
}
