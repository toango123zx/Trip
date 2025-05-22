import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
	LocationStatusEnum,
	ProductCategoryStatusEnum,
	ProviderMapStatusEnum,
} from '@prisma/client';
import { ConflictException, HttpResponseBodySuccessDto } from 'src/common';
import { ProviderMapEnum } from 'src/common/enums/providerMap.enum';
import { productInformation } from 'src/configs';
import { CreateProductDto, ProductEntity } from 'src/models';

import { LocationRepository } from 'src/modules/location/location.repository';
import { ProductCategoryRepository } from 'src/modules/productCategory/productCategory.repository';
import { ProviderMapRepository } from 'src/modules/providerMap/providerMap.repository';

import { ProductRepository } from '../../product.repository';
import { CreateProductCommand } from '../implements';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
	constructor(
		private readonly productRepository: ProductRepository,
		private readonly productCategoryRepository: ProductCategoryRepository,
		private readonly locationRepository: LocationRepository,
		private readonly providerMapRepository: ProviderMapRepository,
	) {}

	async execute(
		command: CreateProductCommand,
	): Promise<HttpResponseBodySuccessDto<ProductEntity> | HttpException> {
		const { createProductRequestDto, supplierInformation } = command;
		const {
			locationId,
			productCategoryId,
			productImageUrls,
			urlMap,
			...productData
		} = createProductRequestDto;

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

		const [providerMaps, totalRecords] =
			await this.providerMapRepository.findProviderMaps(
				ProviderMapEnum.Google,
				undefined,
				ProviderMapStatusEnum.active,
			);
		if (totalRecords === 0) {
			throw new ConflictException('Provider map not found');
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
			mapAddress: {
				create: {
					urlMap: urlMap,
					providerMap: {
						connect: {
							id: providerMaps[0].id,
						},
					},
				},
			},
		};
		const newProduct = await this.productRepository.createProduct(
			product,
			productImageUrls,
		);
		return {
			success: true,
			data: newProduct,
		};
	}
}
