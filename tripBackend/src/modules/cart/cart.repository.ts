import { Injectable } from '@nestjs/common';

import { IPaginationQuery } from 'src/common';
import { CartEntity } from 'src/models';

import { PrismaService } from '../database/services';
import { ProductOrderByDto } from '../product/dtos';

@Injectable()
export class CartRepository {
	constructor(private readonly prismaService: PrismaService) { }

	async getCartByUserId(
		keyword: string,
		pagination: IPaginationQuery,
		userId: string,
		filter?: ProductOrderByDto,
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
					},
				},
			}),
		]);
		return [carts, totalRecords];
	}
}
