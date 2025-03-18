import { Injectable } from '@nestjs/common';

import { CreateProductDto, ProductEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class ProductRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async createProduct(productInformation: CreateProductDto): Promise<ProductEntity> {
		return this.prismaService.product.create({
			data: productInformation,
		});
	}
}
