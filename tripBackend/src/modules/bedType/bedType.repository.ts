import { Injectable } from '@nestjs/common';

import { BedTypeStatusEnum } from '@prisma/client';
import { IPaginationQuery } from 'src/common/interfaces/paginationQuery.interface';
import { BedTypeEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class BedTypeRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findBedTypeByBedTypeId(
		bedTypeId: string,
		bedTypeStatus: BedTypeStatusEnum,
	): Promise<BedTypeEntity> {
		return this.prismaService.bedType.findFirst({
			where: {
				id: bedTypeId,
				status: bedTypeStatus,
			},
		});
	}

	async findBedTypeByBedTypeName(
		bedTypeName: string,
		bedTypeStatus: BedTypeStatusEnum,
	): Promise<BedTypeEntity> {
		return this.prismaService.bedType.findFirst({
			where: {
				name: bedTypeName,
				status: bedTypeStatus,
			},
		});
	}

	async findBedTypesByBedTypeIds(
		bedTypeIds: string[],
		bedTypeStatus: BedTypeStatusEnum,
		pagination: IPaginationQuery = {} as IPaginationQuery,
	): Promise<[BedTypeEntity[], number]> {
		const [bedTypes, totalRecords] = await Promise.all([
			this.prismaService.bedType.findMany({
				where: {
					id: {
						in: bedTypeIds,
					},
					status: bedTypeStatus,
				},
				skip: pagination.skip,
				take: pagination.take,
			}),
			this.prismaService.bedType.count({
				where: {
					id: {
						in: bedTypeIds,
					},
					status: bedTypeStatus,
				},
			}),
		]);
		return [bedTypes, totalRecords];
	}
}
