import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { PaginationDto, HttpResponseBodyDto } from 'src/common';

import { GetLocationResponseDto, LocationFilterRequestDto } from './dtos';
import { GetLocationsQuery } from './queries/implements';

@Controller('location')
export class LocationController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get()
	async getLocations(
		@Query() pagination: PaginationDto,
		@Query() search?: LocationFilterRequestDto,
	): Promise<HttpResponseBodyDto<GetLocationResponseDto[]>> {
		return this.queryBus.execute(new GetLocationsQuery(pagination, search));
	}
}
