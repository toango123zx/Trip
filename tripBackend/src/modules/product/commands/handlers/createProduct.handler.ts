import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LocationStatusEnum, ProductCategoryStatusEnum } from '@prisma/client';
import { ConflictException, HttpResponseBodySuccessDto } from 'src/common';
import { productInformation } from 'src/configs';
import { CreateProductDto, ProductEntity } from 'src/models';

import { LocationRepository } from 'src/modules/location/location.repository';
import { ProductCategoryRepository } from 'src/modules/productCategory/productCategory.repository';

import { ProductRepository } from '../../product.repository';
import { CreateProductCommand } from '../implements';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
	constructor(
		private readonly productRepository: ProductRepository,
		private readonly productCategoryRepository: ProductCategoryRepository,
		private readonly locationRepository: LocationRepository,
	) {}

	async execute(
		command: CreateProductCommand,
	): Promise<HttpResponseBodySuccessDto<ProductEntity> | HttpException> {
		const { createProductRequestDto, supplierInformation } = command;
		const { locationId, productCategoryId, ...productData } = createProductRequestDto;

		const productCategory =
			await this.productCategoryRepository.findProductCategoryByProductCategoryId(
				productCategoryId,
				ProductCategoryStatusEnum.active,
			);

		if (!productData.posterImageUrl) {
			productData.posterImageUrl = productInformation.defaultProductImageUrl;
		}

		const location = await this.locationRepository.findLocationByLocationId(
			locationId,
			LocationStatusEnum.active,
		);

		if (!productCategory || !location) {
			throw new ConflictException('Product category or location not found');
		}
		const product: CreateProductDto = {
			...productData,
			supplier: {
				connect: {
					id: supplierInformation.supplier.id,
				},
			},
			location: {
				connect: {
					id: location.id,
				},
			},
			productCategory: {
				connect: {
					id: productCategory.id,
				},
			},
		};
		const newProduct = await this.productRepository.createProduct(product);
		return {
			success: true,
			data: newProduct,
		};
	}
}
