import { Injectable } from '@nestjs/common';

import { DiscountEligibilityStatusEnum } from '@prisma/client';
import { IPaginationQuery } from 'src/common';
import { DiscountEligibilityEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { DiscountEligibilityOrderByDto } from './dtos';

@Injectable()
export class DiscountEligibilityRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findDiscountEligibilities(
		pagination: IPaginationQuery,
		keyword?: string,
		status?: DiscountEligibilityStatusEnum,
		filter?: DiscountEligibilityOrderByDto,
	): Promise<[DiscountEligibilityEntity[], number]> {
		const orderBy = Object.entries(filter || {})
			.filter(([_, value]) => Boolean(value))
			.map(([key, value]) => ({ [key]: value }));
		const [discountEligibilities, totalRecords] = await Promise.all([
			this.prismaService.discountEligibility.findMany({
				where: {
					name: {
						contains: keyword,
						mode: 'insensitive',
					},
					status: status,
				},
				skip: pagination.skip,
				take: pagination.take,
				orderBy: orderBy,
			}),
			this.prismaService.discountEligibility.count({
				where: {
					name: {
						contains: keyword,
						mode: 'insensitive',
					},
					status: status,
				},
			}),
		]);
		return [discountEligibilities, totalRecords];
	}

	async findDiscountEligibilityByDiscountEligibilityId(
		discountEligibilityId: string,
	): Promise<DiscountEligibilityEntity> {
		return this.prismaService.discountEligibility.findUnique({
			where: {
				id: discountEligibilityId,
			},
		});
	}
}
