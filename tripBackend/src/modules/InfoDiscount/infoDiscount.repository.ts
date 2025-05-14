import { Injectable } from '@nestjs/common';

import { InfoDiscountStatusEnum } from '@prisma/client';
import { InfoDiscountEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class InfoDiscountRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async createInfoDiscountForProductSchedules(
		discoutId: string,
		productScheduleIds: string[],
	): Promise<InfoDiscountEntity[]> {
		const infoDiscounts = productScheduleIds.map((productSchedule) => ({
			discountId: discoutId,
			productScheduleId: productSchedule,
		}));
		return this.prismaService.infoDiscount.createManyAndReturn({
			data: infoDiscounts,
		});
	}

	async deleteInfoDiscountForProductSchedules(
		discountId: string,
		productScheduleIds: string[],
	): Promise<InfoDiscountEntity[]> {
		return this.prismaService.infoDiscount.updateManyAndReturn({
			include: {
				productSchedule: {
					include: {
						product: {
							include: {
								productCategory: true,
								supplier: {
									include: {
										user: {
											include: {
												role: true,
											},
										},
									},
								},
							},
						},
					},
				},
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
				discountId: discountId,
				productScheduleId: {
					in: productScheduleIds,
				},
			},
			data: {
				status: InfoDiscountStatusEnum.inactive,
			},
		});
	}
}
