import { Injectable } from '@nestjs/common';

import { ProductRateStatusEnum } from '@prisma/client';
import { IPaginationQuery } from 'src/common';
import { CreateProductRateDto, ProductRateEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { ProductRateOrderByDto } from './dto';

@Injectable()
export class ProductRateRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findProductRatesByProductId(
		productId: string,
		userId?: string,
		star?: number,
		status?: ProductRateStatusEnum,
		pagination: IPaginationQuery = {} as IPaginationQuery,
		filter?: ProductRateOrderByDto,
	): Promise<[ProductRateEntity[], number]> {
		const orderBy = Object.entries(filter || {})
			.filter(([_, value]) => Boolean(value))
			.map(([key, value]) => ({ [key]: value }));

		const [productRates, totalRecords] = await Promise.all([
			this.prismaService.productRate.findMany({
				include: {
					user: true,
				},
				where: {
					productId: productId,
					userId: userId,
					star: star,
					status: status,
				},
				orderBy: orderBy,
				take: pagination.take,
				skip: pagination.skip,
			}),
			this.prismaService.productRate.count({
				where: {
					productId: productId,
					userId: userId,
					star: star,
					status: status,
				},
			}),
		]);

		return [productRates, totalRecords];
	}

	async createProductRate(
		productRate: CreateProductRateDto,
		productAvgRate: number,
	): Promise<ProductRateEntity> {
		return this.prismaService.$transaction(async (prisma) => {
			await prisma.product.update({
				where: {
					id: productRate.product.connect.id,
				},
				data: {
					avgRate: productAvgRate,
					quantityRate: {
						increment: 1,
					},
				},
			});
			return await prisma.productRate.create({
				data: {
					...productRate,
					user: {
						connect: {
							id: productRate.user.connect.id,
						},
					},
				},
			});
		});
	}
}
