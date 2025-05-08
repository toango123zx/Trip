import { Injectable } from '@nestjs/common';

import {
	BillStatusEnum,
	InfoDiscountStatusEnum,
	ProductScheduleStatusEnum,
	ProductStatusEnum,
} from '@prisma/client';
import { IPaginationQuery } from 'src/common';
import { CreateProductDto, ProductEntity, UpdateProductDto } from 'src/models';

import { PrismaService } from '../database/services';

import { ProductOrderByDto } from './dtos/productOrderBy.dto';

@Injectable()
export class ProductRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findProducts(
		pagination: IPaginationQuery,
		filter?: ProductOrderByDto,
	): Promise<[ProductEntity[], number]> {
		const orderBy = [];
		if (filter.location?.displayName && filter.location?.city) {
			orderBy.push(
				{
					location: {
						displayName: filter.location.displayName,
					},
				},
				{
					location: {
						city: filter.location.city,
					},
				},
			);
			delete filter.location;
		}
		for (const key in filter) {
			if (filter[key]) {
				orderBy.push({
					[key]: filter[key],
				});
			}
		}
		orderBy.push({
			name: 'asc',
		});

		const [products, totalRecords] = await Promise.all([
			this.prismaService.product.findMany({
				include: {
					supplier: {
						include: {
							user: true,
						},
					},
					location: true,
					productCategory: true,
				},
				skip: pagination.skip,
				take: pagination.take,
				orderBy: orderBy,
			}),
			this.prismaService.product.count(),
		]);
		return [products, totalRecords];
	}

	async findProductByProductId(
		productId: string,
		prodcutStatus?: ProductStatusEnum,
	): Promise<ProductEntity> {
		return this.prismaService.product.findFirst({
			include: {
				supplier: {
					include: {
						user: true,
					},
				},
				productImage: true,
				productSchedule: true,
				productRate: {
					include: {
						user: true,
					},
				},
				location: true,
				productCategory: true,
			},
			where: {
				id: productId,
				status: prodcutStatus,
			},
		});
	}

	async createProduct(productInformation: CreateProductDto): Promise<ProductEntity> {
		return this.prismaService.product.create({
			data: productInformation,
		});
	}

	async updateProductByProductId(
		productId: string,
		productInformation: UpdateProductDto,
	): Promise<ProductEntity> {
		return this.prismaService.product.update({
			include: {
				supplier: {
					include: {
						user: true,
					},
				},
				location: true,
				productCategory: true,
			},
			where: {
				id: productId,
			},
			data: productInformation,
		});
	}

	async deleteProductByProductId(productId: string): Promise<ProductEntity> {
		return await this.prismaService.$transaction(async (prisma) => {
			const billsId: string[] = [];
			const inDiscountsId: string[] = [];

			const product = await prisma.product.update({
				include: {
					productSchedule: {
						include: {
							infoBill: {
								include: {
									bill: true,
								},
								where: {
									bill: {
										status: {
											notIn: [
												BillStatusEnum.cancel,
												BillStatusEnum.done,
											],
										},
									},
								},
							},
							infoDiscount: {
								where: {
									status: {
										not: InfoDiscountStatusEnum.inactive,
									},
								},
							},
						},
						where: {
							status: {
								not: ProductScheduleStatusEnum.canceled,
							},
						},
					},
				},
				where: {
					id: productId,
					status: {
						not: ProductStatusEnum.inactive,
					},
				},
				data: {
					status: ProductStatusEnum.inactive,
					productSchedule: {
						updateMany: {
							where: {
								status: {
									not: ProductScheduleStatusEnum.canceled,
								},
							},
							data: {
								status: ProductScheduleStatusEnum.canceled,
							},
						},
					},
				},
			});
			product.productSchedule.forEach((schedule) => {
				schedule.infoBill.forEach((bill) => {
					billsId.push(bill.bill.id);
				});
				schedule.infoDiscount.forEach((info) => {
					inDiscountsId.push(info.id);
				});
			});

			if (inDiscountsId.length > 0) {
				await prisma.infoDiscount.updateMany({
					where: {
						id: {
							in: inDiscountsId,
						},
					},
					data: {
						status: InfoDiscountStatusEnum.inactive,
					},
				});
			}

			if (billsId.length > 0) {
				await prisma.bill.updateMany({
					where: {
						id: {
							in: billsId,
						},
					},
					data: {
						status: BillStatusEnum.cancel,
					},
				});
			}

			return product;
		});
	}
}
