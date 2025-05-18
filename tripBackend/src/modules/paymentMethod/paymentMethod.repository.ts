import { Injectable } from '@nestjs/common';

import { PaymentMethodStatusEnum } from '@prisma/client';
import { IPaginationQuery } from 'src/common';
import { PaymentMethodEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { PaymentMethodOrderByDto } from './dtos';

@Injectable()
export class PaymentMethodRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async getPaymentMethod(
		keyword?: string,
		status?: PaymentMethodStatusEnum,
		pagination: IPaginationQuery = {} as IPaginationQuery,
		filter?: PaymentMethodOrderByDto,
	): Promise<[PaymentMethodEntity[], number]> {
		const orderBy = Object.entries(filter || {})
			.filter(([_, value]) => Boolean(value))
			.map(([key, value]) => ({ [key]: value }));

		const [paymentMethods, totalRecords] = await Promise.all([
			await this.prismaService.paymentMethod.findMany({
				where: {
					name: {
						contains: keyword,
						mode: 'insensitive',
					},
					status: status,
				},
				take: pagination.take,
				skip: pagination.skip,
				orderBy: orderBy,
			}),
			this.prismaService.paymentMethod.count({
				where: {
					name: {
						contains: keyword,
						mode: 'insensitive',
					},
					status: status,
				},
			}),
		]);
		return [paymentMethods, totalRecords];
	}

	async getPaymentMethodByPaymentMethodId(
		paymentMethodId: string,
	): Promise<PaymentMethodEntity> {
		return await this.prismaService.paymentMethod.findFirst({
			where: {
				id: paymentMethodId,
			},
		});
	}
}
