import { Injectable } from '@nestjs/common';

import { LocationStatusEnum, CityEnum } from '@prisma/client';
import { IPaginationQuery } from 'src/common';
import { LocationEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { LocationOrderByDto } from './dtos';

@Injectable()
export class LocationRepository {
	constructor(private readonly prismaService: PrismaService) { }

	async findLocations(
		pagination: IPaginationQuery,
		keyword?: string,
		city?: CityEnum,
		status?: LocationStatusEnum,
		filter?: LocationOrderByDto,
	): Promise<[LocationEntity[], number]> {
		const orderBy = filter
			? Object.entries(filter)
				.filter(([_, value]) => value)
				.map(([key, value]) => ({ [key]: value }))
			: [];
		const [locations, totalRecords] = await Promise.all([
			this.prismaService.location.findMany({
				where: {
					displayName: {
						contains: keyword,
						mode: 'insensitive',
					},
					city: city,
					status: status,
				},
				skip: pagination.skip,
				take: pagination.take,
				orderBy: orderBy,
			}),
			this.prismaService.location.count({
				where: {
					displayName: {
						contains: keyword,
						mode: 'insensitive',
					},
					city: city,
					status: status,
				},
			}),
		]);
		return [locations, totalRecords];
	}

	async findLocationByLocationId(
		locationId: string,
		locationStatus?: LocationStatusEnum,
	): Promise<LocationEntity> {
		return this.prismaService.location.findFirst({
			where: {
				id: locationId,
				status: locationStatus,
			},
		});
	}
}
