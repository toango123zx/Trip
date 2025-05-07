import { Injectable } from '@nestjs/common';

import { DiscountStatusEnum } from '@prisma/client';
import { IPaginationQuery } from 'src/common';
import { CreateDiscountDto, DiscountEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { DiscountOrderByDto } from './dtos';

@Injectable()
export class DiscountRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findDiscountByProductId(
		pagination: IPaginationQuery,
		productId?: string,
		keyword?: string,
		status?: DiscountStatusEnum,
		filter?: DiscountOrderByDto,
	): Promise<[DiscountEntity[], number]> {
		const orderBy = Object.entries(filter || {})
			.filter(([_, value]) => Boolean(value))
			.map(([key, value]) => ({ [key]: value }));
		const [discounts, totalRecords] = await Promise.all([
			this.prismaService.discount.findMany({
				include: {
					user: true,
					infoDiscount: {
						include: {
							product_Schedule: {
								include: {
									product: true,
								},
							},
						},
					},
				},
				where: {
					infoDiscount: {
						some: {
							product_Schedule: {
								product: {
									id: productId,
								},
							},
						},
					},
					status: status,
					name: {
						contains: keyword,
						mode: 'insensitive',
					},
				},
				skip: pagination.skip,
				take: pagination.take,
				orderBy: orderBy,
			}),
			this.prismaService.discount.count({
				where: {
					infoDiscount: {
						some: {
							product_Schedule: {
								product: {
									id: productId,
								},
							},
						},
					},
					status: status,
					name: {
						contains: keyword,
						mode: 'insensitive',
					},
				},
			}),
		]);
		return [discounts, totalRecords];
	}

	async createDiscount(
		discountInformation: CreateDiscountDto,
	): Promise<DiscountEntity> {
		const discount = await this.prismaService.discount.create({
			data: {
				...discountInformation,
				user: {
					connect: {
						id: discountInformation.user.connect.id,
					},
				},
			},
		});
		return discount;
	}
}
