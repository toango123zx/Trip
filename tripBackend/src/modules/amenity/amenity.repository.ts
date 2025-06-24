import { Injectable } from '@nestjs/common';

import { AmenityStatusEnum } from '@prisma/client';
import { IPaginationQuery } from 'src/common';
import { AmenityDto } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class AmenityRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findAmenityByAmenityId(
		amenityId: string,
		amenityStatus: AmenityStatusEnum,
	): Promise<AmenityDto> {
		return this.prismaService.amenity.findFirst({
			where: {
				id: amenityId,
				status: amenityStatus,
			},
		});
	}

	async findAmenityByAmenityName(
		amenityName: string,
		amenityStatus: AmenityStatusEnum,
	): Promise<AmenityDto> {
		return this.prismaService.amenity.findFirst({
			where: {
				name: amenityName,
				status: amenityStatus,
			},
		});
	}

	async findAmenitiesByAmenityIds(
		amenityIds: string[] = [],
		amenityStatus?: AmenityStatusEnum,
		pagination: IPaginationQuery = {} as IPaginationQuery,
	): Promise<[AmenityDto[], number]> {
		const [amenities, totalRecords] = await Promise.all([
			this.prismaService.amenity.findMany({
				where: {
					id: {
						in: amenityIds,
					},
					status: amenityStatus,
				},
				skip: pagination.skip,
				take: pagination.take,
			}),
			this.prismaService.amenity.count({
				where: {
					id: {
						in: amenityIds,
					},
					status: amenityStatus,
				},
			}),
		]);
		return [amenities, totalRecords];
	}
}
