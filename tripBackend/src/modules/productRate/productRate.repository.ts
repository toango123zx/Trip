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

	async findProductRateByProductRateId(
		productRateId: string,
		productRateStatus?: ProductRateStatusEnum,
	): Promise<ProductRateEntity> {
		return this.prismaService.productRate.findFirst({
			include: {
				user: true,
				product: true,
			},
			where: {
				id: productRateId,
				status: productRateStatus,
			},
		});
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

	async updateDeleteProductRate(
		productRateId: string,
		productAvgRate: number,
	): Promise<ProductRateEntity> {
		return this.prismaService.$transaction(async (prisma) => {
			return await prisma.productRate.update({
				include: {
					user: true,
					product: true,
				},
				where: {
					id: productRateId,
					status: {
						not: ProductRateStatusEnum.removed,
					},
				},
				data: {
					status: ProductRateStatusEnum.removed,
					updateAt: new Date(),
					deletedAt: new Date(),
					product: {
						update: {
							avgRate: productAvgRate,
							quantityRate: {
								decrement: 1,
							},
						},
					},
				},
			});
		});
	}
}
