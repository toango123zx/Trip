import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { HttpResponseBodyDto, PermissionEnum } from 'src/common';

import { AuthPermission } from '../auth/decorators';
import { MyInformation } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import { GetStatisticRequestDto, GetStatisticResponseDto } from './dtos';
import { GetBookedByUserIdQuery, GetRevenueByUserIdQuery } from './queries/implements';

@Controller('statistic')
export class StatisticController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('/revenue')
	@AuthPermission(PermissionEnum.Statistic)
	async getRevenue(
		@MyInformation() myInformation: UserInformationDto,
		@Query() statisticFilter: GetStatisticRequestDto,
	): Promise<HttpResponseBodyDto<GetStatisticResponseDto[]>> {
		return this.queryBus.execute(
			new GetRevenueByUserIdQuery(myInformation, statisticFilter),
		);
	}

	@Get('/booked')
	@AuthPermission(PermissionEnum.Statistic)
	async getBooked(
		@MyInformation() myInformation: UserInformationDto,
		@Query() statisticFilter: GetStatisticRequestDto,
	): Promise<HttpResponseBodyDto<GetStatisticResponseDto[]>> {
		return this.queryBus.execute(
			new GetBookedByUserIdQuery(myInformation, statisticFilter),
		);
	}
}
