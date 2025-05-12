import { Injectable } from '@nestjs/common';

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
}
