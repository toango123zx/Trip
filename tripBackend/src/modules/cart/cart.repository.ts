import { Injectable } from '@nestjs/common';

import { ProductScheduleStatusEnum } from '@prisma/client';
import { IPaginationQuery } from 'src/common';
import { CartEntity } from 'src/models';

import { PrismaService } from '../database/services';
import { ProductOrderByDto } from '../product/dtos';

@Injectable()
export class CartRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async getCartByUserId(
		keyword: string,
		pagination: IPaginationQuery,
		userId: string,
		filter?: ProductOrderByDto,
		productScheduleStatus?: ProductScheduleStatusEnum[],
	): Promise<[CartEntity[], number]> {
		const orderBy = Object.entries(filter || {})
			.filter(([_, value]) => Boolean(value))
			.map(([key, value]) => ({ [key]: value }));
		const [carts, totalRecords] = await Promise.all([
			this.prismaService.cart.findMany({
				include: {
					productSchedule: {
						include: {
							product: {
								include: {
									productCategory: true,
									supplier: {
										include: {
											user: true,
										},
									},
									location: true,
								},
							},
						},
					},
				},
				take: pagination.take,
				skip: pagination.skip,
				orderBy: orderBy,
				where: {
					userId: userId,
					productSchedule: {
						product: {
							name: {
								contains: keyword,
								mode: 'insensitive',
							},
						},
						status: {
							in: productScheduleStatus,
						},
					},
				},
			}),
			this.prismaService.cart.count({
				where: {
					userId: userId,
					productSchedule: {
						product: {
							name: {
								contains: keyword,
								mode: 'insensitive',
							},
						},
						status: {
							in: productScheduleStatus,
						},
					},
				},
			}),
		]);
		return [carts, totalRecords];
	}

	async getCartByCartId(cartId: string, userId?: string): Promise<CartEntity> {
		return this.prismaService.cart.findFirst({
			include: {
				productSchedule: {
					include: {
						product: {
							include: {
								productCategory: true,
								supplier: {
									include: {
										user: true,
									},
								},
								location: true,
							},
						},
					},
				},
			},
			where: {
				id: cartId,
				userId: userId,
			},
		});
	}

	async getCartByProductScheduleId(
		productScheduleId: string,
		userId: string,
	): Promise<CartEntity> {
		return this.prismaService.cart.findFirst({
			include: {
				productSchedule: {
					include: {
						product: {
							include: {
								productCategory: true,
								supplier: {
									include: {
										user: true,
									},
								},
								location: true,
							},
						},
					},
				},
			},
			where: {
				productScheduleId: productScheduleId,
				userId: userId,
			},
		});
	}

	async createCart(userId: string, productScheduleId: string): Promise<CartEntity> {
		return this.prismaService.cart.create({
			include: {
				productSchedule: {
					include: {
						product: {
							include: {
								productCategory: true,
								supplier: {
									include: {
										user: true,
									},
								},
								location: true,
							},
						},
					},
				},
			},
			data: {
				userId: userId,
				productScheduleId: productScheduleId,
			},
		});
	}

	async deleteCart(cartId: string, userId: string): Promise<CartEntity> {
		return this.prismaService.cart.delete({
			include: {
				productSchedule: {
					include: {
						product: {
							include: {
								productCategory: true,
								supplier: {
									include: {
										user: true,
									},
								},
								location: true,
							},
						},
					},
				},
			},
			where: {
				id: cartId,
				userId: userId,
			},
		});
	}
}
