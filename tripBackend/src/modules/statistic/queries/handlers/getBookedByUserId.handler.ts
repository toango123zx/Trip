import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
	startOfHour,
	startOfDay,
	startOfWeek,
	startOfMonth,
	startOfYear,
	format,
} from 'date-fns';
import { HttpResponseBodySuccessDto, StatisticTimeUnitEnum } from 'src/common';

import { GetStatisticResponseDto } from '../../dtos';
import { StatisticRepository } from '../../statistic.repositroy';
import { GetBookedByUserIdQuery, GetRevenueByUserIdQuery } from '../implements';
import { stat } from 'fs';

@QueryHandler(GetBookedByUserIdQuery)
export class GetBookedByUserIdHandler implements IQueryHandler<GetBookedByUserIdQuery> {
	constructor(private readonly statisticRepository: StatisticRepository) {}

	async execute(
		query: GetRevenueByUserIdQuery,
	): Promise<HttpResponseBodySuccessDto<GetStatisticResponseDto[]>> {
		const { myInformation, statisticFilter } = query;
		const revenueData = await this.statisticRepository.getBookedByUserId(
			myInformation.id,
			statisticFilter.startTimeSearch,
			statisticFilter.endTimeSearch,
			statisticFilter.productId,
		);
		const groupMap: Record<string, number> = {};
		for (const item of revenueData) {
			const date = new Date(item.bill.createAt);
			let key: string;

			switch (statisticFilter.timeUnit) {
				case StatisticTimeUnitEnum.hour:
					key = format(startOfHour(date), 'yyyy-MM-dd HH:00');
					break;
				case StatisticTimeUnitEnum.day:
					key = format(startOfDay(date), 'yyyy-MM-dd');
					break;
				case StatisticTimeUnitEnum.week:
					key = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
					break;
				case StatisticTimeUnitEnum.month:
					key = format(startOfMonth(date), 'yyyy-MM');
					break;
				case StatisticTimeUnitEnum.year:
					key = format(startOfYear(date), 'yyyy');
					break;
				default:
					key = format(startOfDay(date), 'yyyy-MM-dd');
			}

			groupMap[key] = (groupMap[key] || 0) + Number(item.quantity);
		}

		const revenueResponse: GetStatisticResponseDto[] = Object.entries(groupMap).map(
			([timePoint, value]) => ({
				timePoint,
				value,
			}),
		);

		return {
			success: true,
			data: revenueResponse,
		};
	}
}
