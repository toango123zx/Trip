import { Injectable } from '@nestjs/common';

import { DiscountApplicationScopeStatusEnum } from '@prisma/client';
import { IPaginationQuery } from 'src/common';
import { DiscountApplicationScopeEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { DiscountApplicationScopeOrderByDto } from './dtos';

@Injectable()
export class DiscountApplicationScopeRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findDiscountApplicationScopes(
		page: IPaginationQuery,
		keyword?: string,
		status?: DiscountApplicationScopeStatusEnum,
		filter?: DiscountApplicationScopeOrderByDto,
	): Promise<[DiscountApplicationScopeEntity[], number]> {
		const orderBy = Object.entries(filter || {})
			.filter(([_, value]) => Boolean(value))
			.map(([key, value]) => ({ [key]: value }));
		const [discountApplicationScopes, totalRecords] =
			await this.prismaService.$transaction([
				this.prismaService.discountApplicationScope.findMany({
					where: {
						name: {
							contains: keyword,
							mode: 'insensitive',
						},
						status: status,
					},
					skip: page.skip,
					take: page.take,
					orderBy: orderBy,
				}),
				this.prismaService.discountApplicationScope.count({
					where: {
						name: {
							contains: keyword,
							mode: 'insensitive',
						},
						status: status,
					},
				}),
			]);

		return [discountApplicationScopes, totalRecords];
	}

	async findDiscountApplicationScopeByDiscountApplicationScopeId(
		discountApplicationScopeId: string,
	): Promise<DiscountApplicationScopeEntity> {
		return this.prismaService.discountApplicationScope.findFirst({
			where: {
				id: discountApplicationScopeId,
			},
		});
	}
}
