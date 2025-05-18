import { Injectable } from '@nestjs/common';

import {
	BillStatusEnum,
	DiscountStatusEnum,
	ProductScheduleStatusEnum,
} from '@prisma/client';
import { IPaginationQuery } from 'src/common';
import { BillEntity, CreateBillDto } from 'src/models';

import { PrismaService } from '../database/services';

import { BillOrderByDto } from './dtos/billOrderBy.dto';

@Injectable()
export class BillRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findBillsByUserId(
		pagination: IPaginationQuery,
		userIdTourist?: string,
		userIdSupplier?: string,
		status?: BillStatusEnum,
		billIdFilter?: string,
		filter?: BillOrderByDto,
	): Promise<[BillEntity[], number]> {
		const orderBy = Object.entries(filter || {})
			.filter(([_, value]) => Boolean(value))
			.map(([key, value]) => ({ [key]: value }));

		const [discounts, totalRecords] = await Promise.all([
			this.prismaService.bill.findMany({
				where: {
					id: {
						contains: billIdFilter,
						mode: 'insensitive',
					},
					userId: userIdTourist,
					status: status,
					infoBill: {
						some: {
							productSchedule: {
								product: {
									supplier: {
										userId: userIdSupplier,
									},
								},
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
						contains: billIdFilter,
						mode: 'insensitive',
					},
					userId: userIdTourist,
					status: status,
					infoBill: {
						some: {
							productSchedule: {
								product: {
									supplier: {
										userId: userIdSupplier,
									},
								},
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
							},
						},
					},
				},
				discountForBill: {
					include: {
						discount: true,
					},
				},
				paymentMethod: true,
				transaction: true,
				user: true,
			},
			where: {
				id: billId,
			},
		});
	}
	async createBill(
		userId: string,
		productScheduleIds: string[],
		quantity: number,
		totalPrice: number,
	): Promise<BillEntity> {
		return this.prismaService.bill.create({
			data: {
				user: {
					connect: {
						id: userId,
					},
				},
				infoBill: {
					create: productScheduleIds.map((productScheduleId) => ({
						productScheduleId: productScheduleId,
						quantity: quantity,
					})),
				},
				transaction: {
					create: {
						transactionTarget: 'deposit',
						description: 'Deposit',
						code: 'DEP-' + Date.now().toString(),
					},
				},
				paymentMethod: {
					connect: {
						id: 'cma6ut8m70001e5sc91vb4dn9',
					},
				},
				totalPrice: totalPrice,
				reductionPrice: 0,
			},
		});
	}

	async createBill1(
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
				// update applited discount and get data discount
				const discountIds = [
					...discountIdsForProductSchedules,
					discountIdForBill,
				];
				const discountsDb = await prisma.discount.updateManyAndReturn({
					where: {
						id: {
							in: discountIds,
						},
						// id: discountIds[0],
						status: DiscountStatusEnum.active,
					},
					data: {
						applited: {
							increment: 1,
						},
					},
				});

				// check if discount is full
				const discountIdsFull: string[] = [];
				discountsDb.forEach((discount) => {
					if (discount.quantity >= discount.applited) {
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
					paymentMethod: true,

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
}
