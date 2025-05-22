import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ProductStatusEnum } from '@prisma/client';
import {
	HttpResponseBodySuccessDto,
	NotFoundException,
	ObjectComparerDto,
	OptionalException,
	ValidationException,
} from 'src/common';
import { ProductEntity, UpdateProductDto } from 'src/models';

import { GetProductsResponseDto } from '../../dtos';
import { ProductRepository } from '../../product.repository';
import { UpdateProductInformationByProductIdCommand } from '../implements';

@CommandHandler(UpdateProductInformationByProductIdCommand)
export class UpdateProductInformationByProductIdHandler
	implements ICommandHandler<UpdateProductInformationByProductIdCommand>
{
	constructor(private readonly productRepository: ProductRepository) {}

	async execute(
		command: UpdateProductInformationByProductIdCommand,
	): Promise<HttpResponseBodySuccessDto<GetProductsResponseDto> | HttpException> {
		const { productId, productInformationRequest, supplierInformation } = command;
		const product = await this.productRepository.findProductByProductId(
			productId,
			ProductStatusEnum.active,
		);

		if (!product) {
			throw new NotFoundException('productId');
		}
		if (product.supplier?.id !== supplierInformation.supplier.id) {
			throw new OptionalException(
				HttpStatus.FORBIDDEN,
				'You are not a product supplier.',
			);
		}

		const { addProductImageUrls, removeProductImageIds, ...productData } =
			productInformationRequest;

		const productInformation = new ObjectComparerDto<ProductEntity>(
			product,
		).getUpdatedFields<UpdateProductDto>(productData);

		if (
			!Object.keys(productInformation).length &&
			addProductImageUrls.length === 0 &&
			removeProductImageIds.length === 0
		) {
			throw new ValidationException('No data has been changed.');
		}

		const updatedProduct = await this.productRepository.updateProductByProductId(
			productId,
			productInformation,
			addProductImageUrls,
			removeProductImageIds,
		);

		return {
			success: true,
			data: new GetProductsResponseDto(updatedProduct),
		};
	}
}
