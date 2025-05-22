import { Injectable } from '@nestjs/common';

import { ProviderMapStatusEnum } from '@prisma/client';
import { IPaginationQuery } from 'src/common';
import { ProviderMapEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { ProviderMapOrderByDto } from './dto';

@Injectable()
export class ProviderMapRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findProviderMaps(
		keyword: string,
		pagination: IPaginationQuery = {} as IPaginationQuery,
		status?: ProviderMapStatusEnum,
		filter?: ProviderMapOrderByDto,
	): Promise<[ProviderMapEntity[], number]> {
		const orderBy = filter
			? Object.entries(filter)
					.filter(([_, value]) => value)
					.map(([key, value]) => ({ [key]: value }))
			: [];
		const [providerMaps, totalRecords] = await Promise.all([
			this.prismaService.providerMap.findMany({
				where: {
					name: {
						contains: keyword,
						mode: 'insensitive',
					},
					status: status,
				},
				take: pagination.take,
				skip: pagination.skip,
				orderBy: orderBy,
			}),
			this.prismaService.providerMap.count({
				where: {
					name: {
						contains: keyword,
						mode: 'insensitive',
					},
					status: status,
				},
			}),
		]);
		return [providerMaps, totalRecords];
	}
}
