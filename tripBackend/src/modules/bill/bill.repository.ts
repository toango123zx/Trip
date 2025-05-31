import { Injectable } from '@nestjs/common';

import {
	BillStatusEnum,
	DiscountStatusEnum,
	ProductScheduleStatusEnum,
	TransactionStatusEnum,
} from '@prisma/client';
import { DiscountTypeEnum, IPaginationQuery } from 'src/common';
import { BillEntity, CreateBillDto, DiscountEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { BillOrderByDto } from './dtos/billOrderBy.dto';

@Injectable()
export class BillRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findBillsByUserId(
		pagination: IPaginationQuery = {} as IPaginationQuery,
		userIdTourist?: string,
		userIdSupplier?: string,
		productId?: string,
		productScheduleId?: string,
		billstatus?: BillStatusEnum,
		productScheduleStatus?: ProductScheduleStatusEnum,
		keyword?: string,
		filter?: BillOrderByDto,
	): Promise<[BillEntity[], number]> {
		const orderBy = Object.entries(filter || {})
			.filter(([_, value]) => Boolean(value))
			.map(([key, value]) => ({ [key]: value }));

		const [discounts, totalRecords] = await Promise.all([
			this.prismaService.bill.findMany({
				where: {
					id: {
						contains: keyword,
						mode: 'insensitive',
					},
					userId: userIdTourist,
					status: billstatus,
					infoBill: {
						some: {
							productSchedule: {
								id: productScheduleId,
								product: {
									id: productId,
									supplier: {
										userId: userIdSupplier,
									},
								},
								status: productScheduleStatus,
							},
						},
					},
				},
				take: pagination.take,
				skip: pagination.skip,
				orderBy: orderBy,
			}),
			this.prismaService.bill.count({
				where: {
					id: {
						contains: keyword,
						mode: 'insensitive',
					},
					userId: userIdTourist,
					status: billstatus,
					infoBill: {
						some: {
							productSchedule: {
								id: productScheduleId,
								product: {
									id: productId,
									supplier: {
										userId: userIdSupplier,
									},
								},
								status: productScheduleStatus,
							},
						},
					},
				},
			}),
		]);

		return [discounts, totalRecords];
	}

	async findBillByBillId(billId: string): Promise<BillEntity | null> {
		return this.prismaService.bill.findFirst({
			include: {
				infoBill: {
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
										productCategory: true,
										location: true,
									},
								},
							},
						},
					},
				},
				infoBillDiscount: {
					include: {
						discount: {
							include: {
								infoDiscount: {
									include: {
										productSchedule: true,
									},
								},
								discountEligibility: true,
								discountApplicationScope: true,
								discountType: true,
							},
						},
					},
				},
				discountForBill: {
					include: {
						discount: {
							include: {
								discountEligibility: true,
								discountApplicationScope: true,
								discountType: true,
							},
						},
					},
				},
				transaction: true,
				user: true,
			},
			where: {
				id: billId,
			},
		});
	}

	async createBill(
		bill: CreateBillDto,
		productScheduleIds: string[],
		discountIdsForProductSchedules: string[],
		discountIdForBill: string,
	): Promise<BillEntity> {
		return this.prismaService.$transaction(async (prisma) => {
			const updateSchedules = bill.infoBill.create.map(async (infoBill) => {
				return await prisma.productSchedule.update({
					include: {
						product: true,
					},
					where: {
						id: infoBill.productSchedule.connect.id,
						// booked: {
						// 	lte: quantityProduct - infoBill.quantity,
						// },
						status: ProductScheduleStatusEnum.active,
					},
					data: {
						booked: {
							increment: infoBill.quantity,
						},
					},
				});
			});
			const productSchedulesDb = await Promise.all(updateSchedules);

			// // check if quantity of product schedule is enough
			if (productSchedulesDb.length !== productScheduleIds.length) {
				throw new Error('Mot so lich trinh khong du cho');
			}

			productSchedulesDb.forEach((productSchedule) => {
				if (productSchedule.booked > productSchedule.product.quantityAvailable) {
					throw new Error('Mot so lich trinh khong du cho');
				}
			});

			// check prodct schedule is full
			const productScheduleIdsFull: string[] = [];
			productSchedulesDb.forEach((productSchedule) => {
				if (
					productSchedule.booked === productSchedule.product.quantityAvailable
				) {
					productScheduleIdsFull.push(productSchedule.id);
				}
			});
			// update status of product schedule to full
			if (productScheduleIdsFull.length > 0) {
				await prisma.productSchedule.updateManyAndReturn({
					where: {
						id: {
							in: productScheduleIdsFull,
						},
					},
					data: {
						status: ProductScheduleStatusEnum.full,
					},
				});
			}
			if (discountIdsForProductSchedules.length > 0 || discountIdForBill) {
				const discountIds = [];
				// update applited discount and get data discount

				if (discountIdsForProductSchedules.length > 0) {
					discountIds.push(...discountIdsForProductSchedules);
				}

				if (discountIdForBill) {
					discountIds.push(discountIdForBill);
				}

				const discountsFind = await prisma.discount.findMany({
					include: {
						discountType: true,
						discountEligibility: true,
						discountApplicationScope: true,
						infoDiscount: {
							include: {
								productSchedule: true,
							},
						},
					},
					where: {
						id: {
							in: discountIds,
						},
						status: DiscountStatusEnum.active,
					},
				});
				const discountFixAmount: { id: string; quantity: number }[] = [];
				discountsFind.forEach((discount) => {
					if (discount.discountType.name === DiscountTypeEnum.FixedAmount) {
						discount.infoDiscount.forEach((infoDiscount) => {
							bill.infoBill.create.forEach((infoBill) => {
								if (
									infoDiscount.productScheduleId ===
									infoBill.productSchedule.connect.id
								) {
									discountFixAmount.push({
										id: discount.id,
										quantity: Number(infoBill.quantity),
									});
								}
							});
						});
					}
				});
				const discountPercentIds: string[] = [];
				discountsFind.forEach((discount) => {
					if (discount.discountType.name === DiscountTypeEnum.Percentage) {
						discountPercentIds.push(discount.id);
					}
				});
				const discountsDb: DiscountEntity[] = [];
				if (discountFixAmount.length > 0) {
					discountFixAmount.forEach(async (discount) => {
						const discountFixAmountUpdated = await prisma.discount.update({
							where: {
								id: discount.id,
								status: DiscountStatusEnum.active,
							},
							data: {
								applited: {
									increment: Number(discount.quantity),
								},
							},
						});
						discountsDb.push(discountFixAmountUpdated);
					});
				}
				if (discountPercentIds.length > 0) {
					const discountPercentUpdated =
						await prisma.discount.updateManyAndReturn({
							where: {
								id: {
									in: discountPercentIds,
								},
								status: DiscountStatusEnum.active,
							},
							data: {
								applited: {
									increment: 1,
								},
							},
						});
					discountsDb.push(...discountPercentUpdated);
				}

				// check if discount is full
				const discountIdsFull: string[] = [];
				discountsDb.forEach((discount) => {
					if (discount.quantity <= discount.applited) {
						discountIdsFull.push(discount.id);
					}
				});
				// update status of discount to full
				if (discountIdsFull.length > 0) {
					await prisma.discount.updateMany({
						where: {
							id: {
								in: discountIdsFull,
							},
							status: DiscountStatusEnum.active,
						},
						data: {
							status: DiscountStatusEnum.full,
						},
					});
				}
			}

			const createInfoBillDiscount =
				discountIdsForProductSchedules.length == 0
					? undefined
					: {
							create: discountIdsForProductSchedules.map((discountId) => ({
								discount: {
									connect: {
										id: discountId,
									},
								},
							})),
						};

			// create bill
			return prisma.bill.create({
				include: {
					infoBill: {
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
											productCategory: true,
											location: true,
										},
									},
								},
							},
						},
					},
					infoBillDiscount: {
						include: {
							discount: {
								include: {
									infoDiscount: {
										include: {
											productSchedule: true,
										},
									},
									discountEligibility: true,
									discountApplicationScope: true,
									discountType: true,
								},
							},
						},
					},
					discountForBill: {
						include: {
							discount: {
								include: {
									discountEligibility: true,
									discountApplicationScope: true,
									discountType: true,
								},
							},
						},
					},
					transaction: true,
					user: true,
				},
				data: {
					...bill,
					user: {
						connect: {
							id: bill.user.connect.id,
						},
					},
					status: BillStatusEnum.pending,
					infoBillDiscount: createInfoBillDiscount,
					discountForBill: !discountIdForBill
						? undefined
						: {
								create: {
									discount: {
										connect: {
											id: discountIdForBill,
										},
									},
								},
							},
				},
			});
		});
	}

	async updatePaidBill(billId: string): Promise<BillEntity> {
		return this.prismaService.bill.update({
			where: {
				id: billId,
				status: BillStatusEnum.pending,
				transaction: {
					some: {
						status: TransactionStatusEnum.completed,
					},
				},
			},
			data: {
				status: BillStatusEnum.paid,
			},
		});
	}

	async cancelBillByBillId(billId: string): Promise<BillEntity> {
		return this.prismaService.$transaction(async (prisma) => {
			const bill = await prisma.bill.findFirst({
				include: {
					infoBill: {
						include: {
							productSchedule: true,
						},
					},
				},
				where: {
					id: billId,
					status: {
						in: [BillStatusEnum.pending, BillStatusEnum.paid],
					},
				},
			});
			const billCancelled = await prisma.bill.update({
				include: {
					infoBill: {
						include: {
							productSchedule: true,
						},
					},
				},
				where: {
					id: billId,
					status: {
						in: [BillStatusEnum.pending, BillStatusEnum.paid],
					},
				},
				data: {
					status: BillStatusEnum.cancel,
				},
			});
			for (const infoBill of bill.infoBill) {
				await prisma.productSchedule.update({
					where: {
						id: infoBill.productScheduleId,
					},
					data: {
						booked: {
							decrement: infoBill.quantity,
						},
					},
				});
			}

			if (bill.status === BillStatusEnum.paid) {
				await prisma.user.update({
					where: {
						id: bill.userId,
					},
					data: {
						balance: {
							increment: bill.totalPrice - bill.reductionPrice,
						},
					},
				});
			}

			return billCancelled;
		});
	}
}
