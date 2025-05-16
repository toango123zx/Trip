import { Injectable } from '@nestjs/common';

import { DiscountTypeStatusEnum } from '@prisma/client';
import { DiscountTypeEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { DiscountTypeOrderByDto } from './dtos';

@Injectable()
export class DiscountTypeRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findDiscountTypes(
		page: { skip: number; take: number },
		keyword?: string,
		status?: DiscountTypeStatusEnum,
		filter?: DiscountTypeOrderByDto,
	): Promise<[DiscountTypeEntity[], number]> {
		const orderBy = Object.entries(filter || {})
			.filter(([_, value]) => Boolean(value))
			.map(([key, value]) => ({ [key]: value }));
		const [discountTypes, totalRecords] = await this.prismaService.$transaction([
			this.prismaService.discountType.findMany({
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
			this.prismaService.discountType.count({
				where: {
					name: {
						contains: keyword,
						mode: 'insensitive',
					},
					status: status,
				},
			}),
		]);

		return [discountTypes, totalRecords];
	}

	async findDiscountTypeByDiscountTypeId(
		discountTypeId: string,
	): Promise<DiscountTypeEntity> {
		return this.prismaService.discountType.findUnique({
			where: {
				id: discountTypeId,
			},
		});
	}
}
