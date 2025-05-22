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
		keyword: string,
		pagination: IPaginationQuery,
		userId: string,
		status?: ProductStatusEnum,
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
				where: {
					name: {
						contains: keyword,
						mode: 'insensitive',
					},
					supplier: {
						userId: userId,
					},
					status: status,
				},
				skip: pagination.skip,
				take: pagination.take,
				orderBy: orderBy,
			}),
			this.prismaService.product.count({
				where: {
					name: {
						contains: filter.name,
						mode: 'insensitive',
					},
					supplier: {
						userId: userId,
					},
					status: status,
				},
			}),
		]);
		return [products, totalRecords];
	}

	async findProductByProductId(
		productId: string,
		productStatus?: ProductStatusEnum,
	): Promise<ProductEntity> {
		return this.prismaService.product.findFirst({
			include: {
				supplier: {
					include: {
						user: true,
					},
				},
				productImage: true,
				productSchedule: {
					where: {
						status: {
							not: ProductScheduleStatusEnum.canceled,
						},
					},
				},
				productRate: {
					include: {
						user: true,
					},
				},
				location: true,
				productCategory: true,
				mapAddress: {
					include: {
						providerMap: true,
					},
				},
			},
			where: {
				id: productId,
				status: productStatus,
			},
		});
	}

	async createProduct(
		productInformation: CreateProductDto,
		productImageUrls: string[] = [],
	): Promise<ProductEntity> {
		return this.prismaService.product.create({
			data: {
				...productInformation,
				productImage: {
					createMany: {
						data: productImageUrls.map((url) => ({
							url: url,
						})),
					},
				},
			},
		});
	}

	async updateProductByProductId(
		productId: string,
		productInformation: UpdateProductDto,
		addProductImageUrls: string[] = [],
		removeProductImageIds: string[] = [],
		urlMap: string,
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
			data: {
				...productInformation,
				productImage: {
					createMany: {
						data: addProductImageUrls.map((url) => ({ url: url })),
					},
					deleteMany: {
						id: {
							in: removeProductImageIds,
						},
					},
				},
				mapAddress: {
					update: {
						urlMap: urlMap,
					},
				},
			},
		});
	}

	async deleteProductByProductId(productId: string): Promise<ProductEntity> {
		return await this.prismaService.$transaction(async (prisma) => {
			const billsIdWaitingRefund: string[] = [];
			const billsIdCancel: string[] = [];
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
					deletedAt: new Date(),
					status: ProductStatusEnum.inactive,
					productSchedule: {
						updateMany: {
							where: {
								status: {
									not: ProductScheduleStatusEnum.canceled,
								},
							},
							data: {
								deletedAt: new Date(),
								status: ProductScheduleStatusEnum.canceled,
							},
						},
					},
				},
			});
			product.productSchedule.forEach((schedule) => {
				schedule.infoBill.forEach((info) => {
					if (info.bill.status === BillStatusEnum.paid) {
						return billsIdWaitingRefund.push(info.bill.id);
					}
					billsIdCancel.push(info.bill.id);
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
						deletedAt: new Date(),
						status: InfoDiscountStatusEnum.inactive,
					},
				});
			}

			if (billsIdWaitingRefund.length > 0) {
				await prisma.bill.updateMany({
					where: {
						id: {
							in: billsIdWaitingRefund,
						},
					},
					data: {
						deletedAt: new Date(),
						status: BillStatusEnum.waitingRefund,
					},
				});
			}
			if (billsIdCancel.length > 0) {
				await prisma.bill.updateMany({
					where: {
						id: {
							in: billsIdCancel,
						},
					},
					data: {
						deletedAt: new Date(),
						status: BillStatusEnum.cancel,
					},
				});
			}

			return product;
		});
	}
}
