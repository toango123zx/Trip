import { Injectable } from '@nestjs/common';

import { DiscountStatusEnum, InfoDiscountStatusEnum } from '@prisma/client';
import { IPaginationQuery } from 'src/common';
import { CreateDiscountDto, DiscountEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { DiscountOrderByDto } from './dtos';

@Injectable()
export class DiscountRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findDiscountsByProductId(
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
							productSchedule: {
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
							productSchedule: {
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
							productSchedule: {
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

	async findDiscountByDiscountId(
		discountId: string,
		status?: DiscountStatusEnum,
	): Promise<DiscountEntity> {
		return this.prismaService.discount.findFirst({
			include: {
				user: true,
				infoDiscount: {
					include: {
						productSchedule: {
							include: {
								product: {
									include: {
										supplier: {
											include: {
												user: true,
											},
										},
									},
								},
							},
						},
					},
				},
			},
			where: {
				id: discountId,
				status: status,
			},
		});
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

	async deleteDiscountByDiscountId(discountId: string): Promise<DiscountEntity> {
		return this.prismaService.discount.update({
			include: {
				user: true,
				infoDiscount: {
					include: {
						productSchedule: {
							include: {
								product: {
									include: {
										supplier: {
											include: {
												user: true,
											},
										},
									},
								},
							},
						},
					},
				},
			},
			where: {
				id: discountId,
				status: {
					not: DiscountStatusEnum.canceled,
				},
			},
			data: {
				status: DiscountStatusEnum.canceled,
				infoDiscount: {
					updateMany: {
						where: {
							status: {
								not: InfoDiscountStatusEnum.inactive,
							},
						},
						data: {
							status: InfoDiscountStatusEnum.inactive,
						},
					},
				},
			},
		});
	}
}
