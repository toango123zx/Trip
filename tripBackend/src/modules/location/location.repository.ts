import { Injectable } from '@nestjs/common';

import { LocationStatusEnum, CountryEnum } from '@prisma/client';
import { IPaginationQuery } from 'src/common';
import { LocationEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { LocationOrderByDto } from './dtos';

@Injectable()
export class LocationRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findLocations(
		pagination: IPaginationQuery,
		keyword?: string,
		country?: CountryEnum,
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
					country: country,
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
					country: country,
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
