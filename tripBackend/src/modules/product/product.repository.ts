import { Injectable } from '@nestjs/common';

import { IPaginationQuery } from 'src/common';
import { CreateProductDto, ProductEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { ProductOrderByDto } from './dtos/productOrderBy.dto';

@Injectable()
export class ProductRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async getProducts(
		pagination: IPaginationQuery,
		filter?: ProductOrderByDto,
	): Promise<[ProductEntity[], number]> {
		const orderBy = [];
		if (filter.location.displayName && filter.location.city) {
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

	async createProduct(productInformation: CreateProductDto): Promise<ProductEntity> {
		return this.prismaService.product.create({
			data: productInformation,
		});
	}
}
