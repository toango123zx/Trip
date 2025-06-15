import { Injectable } from '@nestjs/common';

import {
	BillStatusEnum,
	DiscountStatusEnum,
	SystemCheckServiceEnum,
} from '@prisma/client';
import { BillEntity, DiscountEntity, SystemCheckLogEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class AutomationRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findLatestCheckedServicesByServiceName(
		systemService: SystemCheckServiceEnum,
	): Promise<SystemCheckLogEntity[]> {
		return this.prismaService.systemCheckLog.findMany({
			where: {
				systemCheckService: systemService,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: 0,
			skip: 1,
		});
	}

	async findCheckBillByCreateAt(
		createAt: Date = new Date(),
		billStatus: BillStatusEnum[],
	): Promise<[BillEntity[], number]> {
		const [bills, totalRecords] = await Promise.all([
			this.prismaService.bill.findMany({
				where: {
					createAt: {
						gte: createAt,
					},
					status: {
						in: billStatus,
					},
				},
			}),
			this.prismaService.bill.count({
				where: {
					createAt: {
						gte: new Date(createAt.getTime() - 4 * 60 * 60 * 1000),
						lte: new Date(Date.now() - 4 * 60 * 60 * 1000),
					},
					status: {
						in: billStatus,
					},
				},
			}),
		]);
		return [bills, totalRecords];
	}

	async findCheckDiscountByCreateAt(
		createAt: Date = new Date(),
		discountStatus: DiscountStatusEnum[],
	): Promise<[DiscountEntity[], number]> {
		const [discounts, totalRecords] = await Promise.all([
			this.prismaService.discount.findMany({
				where: {
					createAt: {
						gte: createAt,
					},
					status: {
						in: discountStatus,
					},
				},
			}),
			this.prismaService.discount.count({
				where: {
					createAt: {
						gte: new Date(createAt.getTime() - 4 * 60 * 60 * 1000),
						lte: new Date(Date.now() - 4 * 60 * 60 * 1000),
					},
					status: {
						in: discountStatus,
					},
				},
			}),
		]);
		return [discounts, totalRecords];
	}
}
