import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ProductStatusEnum } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { HttpResponseBodySuccessDto, OptionalException } from 'src/common';
import { ProductEntity } from 'src/models';
import { SupplierInformationDto } from 'src/modules/supplier/dtos';

import { ProductRepository } from '../../product.repository';
import { DeleteProductByProductIdCommand } from '../implements';

@CommandHandler(DeleteProductByProductIdCommand)
export class DeleteProductByProductIdHandler
	implements ICommandHandler<DeleteProductByProductIdCommand>
{
	constructor(private readonly productRepository: ProductRepository) {}

	private checkSupplierPermissions(
		supplier: SupplierInformationDto,
		product: ProductEntity,
	): void | HttpException {
		if (
			!plainToInstance(
				SupplierInformationDto,
				supplier,
			).checkSupplierIsProductSupplier(product)
		) {
			throw new OptionalException(
				HttpStatus.FORBIDDEN,
				'You are not a product supplier.',
			);
		}
		return;
	}

	async execute(
		command: DeleteProductByProductIdCommand,
	): Promise<HttpResponseBodySuccessDto<ProductEntity> | HttpException> {
		const { productId, supplierInformation } = command;
		const product = await this.productRepository.findProductByProductId(productId);
		if (product.status === ProductStatusEnum.inactive) {
			throw new OptionalException(HttpStatus.NOT_FOUND, 'Product deleted.');
		}
		this.checkSupplierPermissions(supplierInformation, product);
		const productDeleted =
			await this.productRepository.deleteProductByProductId(productId);
		return {
			success: true,
			data: productDeleted,
		};
	}
}
