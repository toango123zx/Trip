import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, IPaginationQuery } from 'src/common';

import { GetLocationResponseDto, LocationFilterRequestDto } from '../../dtos';
import { LocationRepository } from '../../location.repository';
import { GetLocationsQuery } from '../implements';

@QueryHandler(GetLocationsQuery)
export class GetLocationsHandler implements IQueryHandler<GetLocationsQuery> {
	constructor(private readonly locationRepository: LocationRepository) {}

	async execute(
		query: GetLocationsQuery,
	): Promise<HttpResponseBodySuccessDto<GetLocationResponseDto[]>> {
		const skip = (query.pagination.page - 1) * query.pagination.limit;

		const pagination: IPaginationQuery = {
			skip,
			take: query.pagination.limit,
		};

		const {
			keyword,
			city,
			statusSearch,
			...locationFilter
		}: LocationFilterRequestDto = query.filter;
		const [locations, totalRecords] = await this.locationRepository.findLocations(
			pagination,
			keyword,
			city,
			statusSearch,
			locationFilter,
		);

		const totalPage = Math.ceil(totalRecords / query.pagination.limit);

		const locationsInformation = locations.map(
			(location) => new GetLocationResponseDto(location),
		);

		return {
			success: true,
			data: locationsInformation,
			pagination: {
				totalItems: totalRecords,
				itemsPerPage: locations.length,
				currentPage: query.pagination.page,
				totalPages: totalPage,
			},
		};
	}
}
