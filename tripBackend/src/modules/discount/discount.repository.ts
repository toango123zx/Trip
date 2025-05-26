import { Injectable } from '@nestjs/common';

import {
	DiscountStatusEnum,
	InfoDiscountStatusEnum,
	ProductScheduleStatusEnum,
} from '@prisma/client';
import { IPaginationQuery } from 'src/common';
import { CreateDiscountDto, DiscountEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { DiscountOrderByDto } from './dtos';

@Injectable()
export class DiscountRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findDiscounts(
		schedules?: string[],
		keyword?: string,
		status?: DiscountStatusEnum,
		availabilityTime?: boolean,
		pagination: IPaginationQuery = {} as IPaginationQuery,
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
					discountApplicationScope: true,
					discountEligibility: true,
					discountType: true,
				},
				where: {
					name: {
						contains: keyword,
						mode: 'insensitive',
					},
					infoDiscount: {
						some: {
							productScheduleId: {
								in: schedules,
							},
						},
					},
					startTime: !availabilityTime
						? undefined
						: {
								lte: new Date(),
							},
					endTime: !availabilityTime
						? undefined
						: {
								gte: new Date(),
							},
					status: status,
				},
				orderBy: orderBy,
				skip: pagination.skip,
				take: pagination.take,
			}),
			this.prismaService.discount.count({
				where: {
					name: {
						contains: keyword,
						mode: 'insensitive',
					},
					infoDiscount: {
						some: {
							productScheduleId: {
								in: schedules,
							},
						},
					},
					startTime: !availabilityTime
						? undefined
						: {
								lte: new Date(),
							},
					endTime: !availabilityTime
						? undefined
						: {
								gte: new Date(),
							},
					status: status,
				},
			}),
		]);
		return [discounts, totalRecords];
	}

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

	async findDiscountsByUserId(
		pagination: IPaginationQuery,
		userId: string,
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
					userId: userId,
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
					userId: userId,
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

	async findDiscountsByDiscountIds(
		discountIds: string[],
		userIds?: string[],
		scheduleIds?: string[],
		status?: DiscountStatusEnum,
		statusInfoDiscount?: InfoDiscountStatusEnum,
		availabilityTime?: boolean,
		pagination: IPaginationQuery = {} as IPaginationQuery,
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
						where: {
							status: statusInfoDiscount,
						},
					},
					discountApplicationScope: true,
					discountEligibility: true,
					discountType: true,
				},
				where: {
					id: { in: discountIds },
					userId: { in: userIds },
					startTime: !availabilityTime
						? undefined
						: {
								lte: new Date(),
							},
					endTime: !availabilityTime
						? undefined
						: {
								gte: new Date(),
							},
					infoDiscount: {
						some: {
							productScheduleId: { in: scheduleIds },
						},
					},
					status: status,
				},
				skip: pagination.skip,
				take: pagination.take,
				orderBy: orderBy,
			}),
			this.prismaService.discount.count({
				where: {
					id: { in: discountIds },
					userId: { in: userIds },
					startTime: !availabilityTime
						? undefined
						: {
								lte: new Date(),
							},
					endTime: !availabilityTime
						? undefined
						: {
								gte: new Date(),
							},
					status: status,
				},
			}),
		]);

		return [discounts, totalRecords];
	}

	async findDiscountByDiscountId(
		discountId: string,
		statusDiscount?: DiscountStatusEnum,
		statusInfoDiscount?: InfoDiscountStatusEnum,
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
					where: {
						status: statusInfoDiscount,
					},
				},
				discountApplicationScope: true,
				discountEligibility: true,
				discountType: true,
			},
			where: {
				id: discountId,
				status: statusDiscount,
			},
		});
	}

	async createDiscount(
		discountInformation: CreateDiscountDto,
		scheduleIds?: string[],
	): Promise<DiscountEntity> {
		const discount = await this.prismaService.discount.create({
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
				discountApplicationScope: true,
				discountEligibility: true,
				discountType: true,
			},
			data: {
				...discountInformation,
				user: {
					connect: {
						id: discountInformation.user.connect.id,
					},
				},
				infoDiscount: {
					create: scheduleIds?.map((scheduleId) => ({
						productSchedule: {
							connect: {
								id: scheduleId,
								status: {
									not: ProductScheduleStatusEnum.canceled,
								},
							},
						},
					})),
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
				discountApplicationScope: true,
				discountEligibility: true,
				discountType: true,
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
