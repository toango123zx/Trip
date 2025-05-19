import { Injectable } from '@nestjs/common';

import {
	BillStatusEnum,
	InfoDiscountStatusEnum,
	ProductScheduleStatusEnum,
	TransactionStatusEnum,
} from '@prisma/client';
import {
	DiscountTypeEnum,
	IPaginationQuery,
	OrderByEnum,
	OrderBySearchDto,
} from 'src/common';
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

	async updateCompletedProductScheduleByProductScheduleComplete(
		productScheduleId: string,
	): Promise<ProductScheduleEntity> {
		return this.prismaService.$transaction(async (prisma) => {
			const productSchedule = await prisma.productSchedule.update({
				include: {
					product: {
						include: {
							supplier: true,
						},
					},
					infoBill: {
						include: {
							bill: true,
						},
					},
				},
				where: {
					id: productScheduleId,
					status: {
						not: {
							in: [
								ProductScheduleStatusEnum.canceled,
								ProductScheduleStatusEnum.completed,
							],
						},
					},
				},
				data: {
					status: ProductScheduleStatusEnum.completed,
				},
			});

			const billIdsPaid: string[] = [];
			const billIdsCancel: string[] = [];
			productSchedule.infoBill.forEach((infoBill) => {
				if (infoBill.bill.status === BillStatusEnum.pending) {
					billIdsCancel.push(infoBill.bill.id);
					return;
				}
				if (infoBill.bill.status === BillStatusEnum.paid) {
					billIdsPaid.push(infoBill.bill.id);
				}
			});

			if (billIdsCancel.length > 0) {
				const billCancel = await prisma.bill.updateManyAndReturn({
					include: {
						transaction: true,
					},
					where: {
						id: {
							in: billIdsCancel,
						},
						infoBill: {
							some: {
								productSchedule: {
									status: ProductScheduleStatusEnum.completed,
								},
							},
						},
						status: BillStatusEnum.pending,
					},
					data: {
						status: BillStatusEnum.cancel,
						deletedAt: new Date(),
					},
				});

				const transactionIds = billCancel.map(
					(bill: BillEntity) => bill.transaction.id,
				);
				await prisma.transaction.updateMany({
					where: {
						id: {
							in: transactionIds,
						},
						status: TransactionStatusEnum.pending,
					},
					data: {
						status: TransactionStatusEnum.canceled,
						deletedAt: new Date(),
					},
				});

				const billIdsCancelDb = await prisma.bill.findMany({
					include: {
						transaction: true,
						infoBill: {
							include: {
								productSchedule: true,
							},
						},
					},
					where: {
						id: {
							in: billIdsCancel,
						},
						status: BillStatusEnum.cancel,
					},
				});

				billIdsCancelDb.forEach((bill) => {
					return bill.infoBill.map(async (info) => {
						return await prisma.productSchedule.update({
							where: {
								id: info.productSchedule.id,
							},
							data: {
								booked: {
									decrement: info.quantity,
								},
							},
						});
					});
				});
			}
			if (billIdsPaid.length > 0) {
				await prisma.bill.updateManyAndReturn({
					where: {
						id: {
							in: billIdsPaid,
						},
						infoBill: {
							every: {
								productSchedule: {
									status: ProductScheduleStatusEnum.completed,
								},
							},
						},
						status: BillStatusEnum.paid,
					},
					data: {
						status: BillStatusEnum.done,
					},
				});
				await prisma.product.update({
					where: {
						id: productSchedule.productId,
					},
					data: {
						quantityCompleted: {
							increment: productSchedule.booked,
						},
					},
				});

				const billR = await prisma.bill.findMany({
					include: {
						infoBill: {
							include: {
								productSchedule: true,
							},
							where: {
								productSchedule: {
									id: productScheduleId,
									status: ProductScheduleStatusEnum.completed,
								},
							},
						},
						infoBillDiscount: {
							include: {
								discount: {
									include: {
										infoDiscount: true,
										user: true,
										discountApplicationScope: true,
										discountType: true,
										discountEligibility: true,
									},
								},
							},
							where: {
								discount: {
									infoDiscount: {
										some: {
											productScheduleId: productScheduleId,
										},
									},
								},
							},
						},
						discountForBill: {
							include: {
								discount: {
									include: {
										user: true,
										discountApplicationScope: true,
										discountType: true,
										discountEligibility: true,
									},
								},
							},
							where: {
								discount: {
									infoDiscount: {
										some: {
											productScheduleId: productScheduleId,
										},
									},
								},
							},
						},
					},

					where: {
						id: {
							in: billIdsPaid,
						},
					},
				});

				let totalPrice = 0;
				billR.forEach((bill) => {
					let price = 0;
					let quantity = 0;
					const discountForProductSchedule = bill.infoBillDiscount.map(
						(info) => info.discount,
					);
					const discountForBill = bill.discountForBill.map(
						(info) => info.discount,
					);
					const discountApplied = [
						...discountForProductSchedule,
						...discountForBill,
					];
					bill.infoBill.map((info) => {
						if (info.productScheduleId === productScheduleId) {
							price += info.productSchedule.price * info.quantity;
							quantity += info.quantity;
						}
					});
					let discountPrice = 0;
					discountApplied.forEach((discount) => {
						if (discount.discountType.name === DiscountTypeEnum.Percentage) {
							discountPrice += (price * discount.value) / 100;
							return;
						}
						if (discount.discountType.name === DiscountTypeEnum.FixedAmount) {
							discountPrice += discount.value * quantity;
							return;
						}
					});
					totalPrice += price - discountPrice;
				});
				prisma.user.update({
					where: {
						id: productSchedule.product.supplier.userId,
					},
					data: {
						balance: {
							increment: totalPrice,
						},
					},
				});
			}

			return productSchedule;
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
				if (info.bill.status === BillStatusEnum.paid) {
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
