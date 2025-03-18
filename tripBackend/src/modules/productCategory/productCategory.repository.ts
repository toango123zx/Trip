import { Injectable } from '@nestjs/common';

import { ProductCategoryStatusEnum } from '@prisma/client';
import { ProductCategoryEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class ProductCategoryRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findProductCategoryByProductCategoryId(
		productCategoryId: string,
		productCategoryStatus?: ProductCategoryStatusEnum,
	): Promise<ProductCategoryEntity> {
		return this.prismaService.productCategory.findFirst({
			where: {
				id: productCategoryId,
				status: productCategoryStatus,
			},
		});
	}
}
