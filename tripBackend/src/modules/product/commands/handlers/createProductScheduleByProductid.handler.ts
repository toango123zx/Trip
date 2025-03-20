import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ProductStatusEnum } from '@prisma/client';
import {
	HttpResponseBodySuccessDto,
	NotFoundException,
	OptionalException,
	ValidationException,
} from 'src/common';
import { CreateProductScheduleDto, ProductScheduleEntity } from 'src/models';

import { ProductScheduleRepository } from 'src/modules/productSchedule/productSchedule.repository';

import { ProductRepository } from '../../product.repository';
import { CreateProductScheduleByProductIdCommand } from '../implements';

@CommandHandler(CreateProductScheduleByProductIdCommand)
export class CreateProductScheduleByProductIdHandler
	implements ICommandHandler<CreateProductScheduleByProductIdCommand>
{
	constructor(
		private readonly productRepository: ProductRepository,
		private readonly productScheduleRepository: ProductScheduleRepository,
	) {}

	async execute(
		command: CreateProductScheduleByProductIdCommand,
	): Promise<HttpResponseBodySuccessDto<ProductScheduleEntity> | HttpException> {
		const { productId, productScheduleInformationRequest, supplierInformation } =
			command;
		if (
			productScheduleInformationRequest.endTime <
			productScheduleInformationRequest.startTime
		) {
			throw new ValidationException('End time must be after start time.');
		}
		if (
			productScheduleInformationRequest.endOrder <
			productScheduleInformationRequest.startOrder
		) {
			throw new ValidationException('End order must be after start order.');
		}

		const product = await this.productRepository.findProductByProductId(
			productId,
			ProductStatusEnum.active,
		);

		if (!product) {
			throw new NotFoundException('productId');
		}

		if (!supplierInformation.checkSupplierIsProductSupplier(product)) {
			throw new OptionalException(
				HttpStatus.FORBIDDEN,
				'You are not a product supplier.',
			);
		}

		const productScheduleInformation: CreateProductScheduleDto = {
			product: {
				connect: {
					id: product.id,
				},
			},
			...productScheduleInformationRequest,
		};

		const productSchedule =
			await this.productScheduleRepository.createProductScheduleByProductId(
				productScheduleInformation,
			);
		return {
			success: true,
			data: productSchedule,
		};
	}
}
