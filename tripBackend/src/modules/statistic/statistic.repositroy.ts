import { Injectable } from '@nestjs/common';

import { BillStatusEnum, ProductScheduleStatusEnum } from '@prisma/client';
import { InfoBillEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { RevenueGroupByResultInRepositoryResponseDto } from './dtos';

@Injectable()
export class StatisticRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async getRevenueByUserId(
		userId: string,
		startTime: Date,
		endTime: Date,
		productId?: string,
	): Promise<RevenueGroupByResultInRepositoryResponseDto[]> {
		const data = await this.prismaService.transaction.groupBy({
			by: ['createAt'],
			_sum: {
				amount: true,
			},
			orderBy: {
				createAt: 'asc',
			},
			where: {
				bill: {
					infoBill: {
						some: {
							productSchedule: {
								product: {
									id: productId,
									supplier: {
										userId: userId,
									},
								},
								status: 'completed',
							},
						},
					},
					status: 'done',
				},
				createAt: {
					gte: startTime,
					lte: endTime,
				},
				status: 'completed',
			},
		});
		return data;
	}
	async getBookedByUserId(
		userId: string,
		startTime: Date,
		endTime: Date,
		productId?: string,
	): Promise<InfoBillEntity[]> {
		return this.prismaService.infoBill.findMany({
			include: {
				bill: true,
			},
			where: {
				bill: {
					status: {
						in: [
							BillStatusEnum.pending,
							BillStatusEnum.done,
							BillStatusEnum.paid,
						],
					},
					createAt: {
						gte: startTime,
						lte: endTime,
					},
				},
				productSchedule: {
					product: {
						id: productId,
						// supplier: {
						// 	userId: userId,
						// },
					},
					status: {
						in: [
							ProductScheduleStatusEnum.full,
							ProductScheduleStatusEnum.completed,
							ProductScheduleStatusEnum.active,
						],
					},
				},
			},
		});
	}
}
