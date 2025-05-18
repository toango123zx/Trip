import { Injectable } from '@nestjs/common';

import {
	BillStatusEnum,
	InfoDiscountStatusEnum,
	ProductScheduleStatusEnum,
} from '@prisma/client';
import { IPaginationQuery, OrderByEnum, OrderBySearchDto } from 'src/common';
import { BillEntity, CreateProductScheduleDto, ProductScheduleEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { ProductScheduleOrderByDto } from './dtos';

@Injectable()
export class ProductScheduleRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findProductSchedulesBySupplierId(
		supplierId: string,
		pagination: IPaginationQuery,
		status?: ProductScheduleStatusEnum,
		filter?: ProductScheduleOrderByDto,
		startTime?: Date,
		endTime?: Date,
	): Promise<[ProductScheduleEntity[], number]> {
		const orderBy = filter
			? new OrderBySearchDto().convertOrderByToORM<ProductScheduleOrderByDto>(
					filter,
				)
			: [];
		orderBy.push({
			startTime: OrderByEnum.ASC,
		});

		const [productSchedules, totalRecords] = await Promise.all([
			this.prismaService.productSchedule.findMany({
				include: {
					product: true,
				},
				where: {
					product: {
						supplierId: supplierId,
					},
					startTime: startTime,
					endTime: endTime,
					status: status,
				},
				orderBy: orderBy,
				take: pagination.take,
				skip: pagination.skip,
			}),
			this.prismaService.productSchedule.count({
				where: {
					product: {
						supplierId: supplierId,
					},
					startTime: startTime,
					endTime: endTime,
					status: status,
				},
			}),
		]);
		return [productSchedules, totalRecords];
	}

	async findProductSchedulesByProductSchedulesId(
		productSchedulesId: string[],
		status?: ProductScheduleStatusEnum,
		availabilityTime?: boolean,
		pagination: IPaginationQuery = {} as IPaginationQuery,
		filter?: ProductScheduleOrderByDto,
	): Promise<[ProductScheduleEntity[], number]> {
		const orderBy = filter
			? new OrderBySearchDto().convertOrderByToORM<ProductScheduleOrderByDto>(
					filter,
				)
			: [];
		const [productSchedules, totalRecords] = await Promise.all([
			this.prismaService.productSchedule.findMany({
				include: {
					product: true,
				},
				where: {
					id: {
						in: productSchedulesId,
					},
					startOrder: !availabilityTime
						? undefined
						: {
								lte: new Date(),
							},
					endOrder: !availabilityTime
						? undefined
						: {
								gte: new Date(),
							},
					status: status,
				},
				orderBy: orderBy,
				take: pagination.take,
				skip: pagination.skip,
			}),
			this.prismaService.productSchedule.count({
				where: {
					id: {
						in: productSchedulesId,
					},
					startOrder: !availabilityTime
						? undefined
						: {
								lte: new Date(),
							},
					endOrder: !availabilityTime
						? undefined
						: {
								gte: new Date(),
							},
					status: status,
				},
			}),
		]);
		return [productSchedules, totalRecords];
	}

	async findNonProductSchedulesByDiscountIdAndUserId(
		discountId: string,
		productId: string,
		userId: string,
		pagination: IPaginationQuery,
		filter: ProductScheduleOrderByDto,
		startTime?: Date,
		endTime?: Date,
	): Promise<[ProductScheduleEntity[], number]> {
		const orderBy = filter
			? new OrderBySearchDto().convertOrderByToORM<ProductScheduleOrderByDto>(
					filter,
				)
			: [];
		orderBy.push({
			startTime: OrderByEnum.ASC,
		});

		const [productSchedules, totalRecords] = await Promise.all([
			this.prismaService.productSchedule.findMany({
				include: {
					product: true,
				},
				where: {
					product: {
						id: productId,
						supplier: {
							userId: userId,
						},
					},
					infoDiscount: {
						none: {
							discountId: discountId,
						},
					},
					startTime: startTime,
					endTime: endTime,
					status: {
						not: ProductScheduleStatusEnum.canceled,
					},
				},
				orderBy: orderBy,
				take: pagination.take,
				skip: pagination.skip,
			}),
			this.prismaService.productSchedule.count({
				where: {
					product: {
						supplier: {
							userId: userId,
						},
					},
					infoDiscount: {
						none: {
							discountId: discountId,
						},
					},
					startTime: startTime,
					endTime: endTime,
					status: {
						not: ProductScheduleStatusEnum.canceled,
					},
				},
			}),
		]);
		return [productSchedules, totalRecords];
	}

	async findProductScheduleByProductScheduleId(
		productScheduleId: string,
		status?: ProductScheduleStatusEnum,
	): Promise<ProductScheduleEntity> {
		return this.prismaService.productSchedule.findFirst({
			include: {
				product: {
					include: {
						supplier: true,
					},
				},
			},
			where: {
				id: productScheduleId,
				status: status,
			},
		});
	}

	async createProductScheduleByProductId(
		scheduleInformation: CreateProductScheduleDto,
	): Promise<ProductScheduleEntity> {
		return this.prismaService.productSchedule.create({
			data: scheduleInformation,
		});
	}

	async deleteProductScheduleByProductScheduleId(
		productScheduleId: string,
	): Promise<[ProductScheduleEntity, BillEntity[], BillEntity[]]> {
		return await this.prismaService.$transaction(async (prisma) => {
			const billsIdWaitingRefund: string[] = [];
			const billsIdCancel: string[] = [];
			let billsWaitingRefund: BillEntity[] = [];
			let billsCancel: BillEntity[] = [];

			const productSchedule = await prisma.productSchedule.update({
				include: {
					infoBill: {
						include: {
							bill: true,
						},
						where: {
							bill: {
								status: {
									notIn: [BillStatusEnum.cancel, BillStatusEnum.done],
								},
							},
						},
					},
				},
				where: {
					id: productScheduleId,
				},
				data: {
					deletedAt: new Date(),
					status: ProductScheduleStatusEnum.canceled,
					infoDiscount: {
						updateMany: {
							where: {
								status: {
									not: InfoDiscountStatusEnum.inactive,
								},
							},
							data: {
								deletedAt: new Date(),
								status: InfoDiscountStatusEnum.inactive,
							},
						},
					},
				},
			});
			productSchedule.infoBill.forEach((info) => {
				if (info.bill.status === BillStatusEnum.paided) {
					return billsIdWaitingRefund.push(info.bill.id);
				}
				billsIdCancel.push(info.bill.id);
			});

			if (billsIdWaitingRefund.length > 0) {
				billsWaitingRefund = await prisma.bill.updateManyAndReturn({
					where: {
						id: {
							in: billsIdWaitingRefund,
						},
					},
					data: {
						deletedAt: new Date(),
						status: BillStatusEnum.waitingRefund,
					},
				});
			}

			if (billsIdCancel.length > 0) {
				billsCancel = await prisma.bill.updateManyAndReturn({
					where: {
						id: {
							in: billsIdCancel,
						},
					},
					data: {
						deletedAt: new Date(),
						status: BillStatusEnum.cancel,
					},
				});
			}

			return [productSchedule, billsWaitingRefund, billsCancel];
		});
	}
}
