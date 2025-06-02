import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ProductScheduleStatusEnum } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { HttpResponseBodySuccessDto, OptionalException } from 'src/common';
import { ProductScheduleEntity } from 'src/models';
import { SupplierInformationDto } from 'src/modules/supplier/dtos';

import { ProductScheduleRepository } from '../../productSchedule.repository';
import { UpdateCompletedProductScheduleByProductScheduleCompleteCommand } from '../implements';

@CommandHandler(UpdateCompletedProductScheduleByProductScheduleCompleteCommand)
export class UpdateCompletedProductScheduleByProductScheduleHandler
	implements
		ICommandHandler<UpdateCompletedProductScheduleByProductScheduleCompleteCommand>
{
	constructor(private readonly productScheduleRepository: ProductScheduleRepository) {}

	private checkSupplierPermissions(
		supplier: SupplierInformationDto,
		productSchedule: ProductScheduleEntity,
	): void | HttpException {
		if (
			!plainToInstance(
				SupplierInformationDto,
				supplier,
			).checkSupplierIsProductSupplier(productSchedule.product)
		) {
			throw new OptionalException(
				HttpStatus.FORBIDDEN,
				'You are not a product supplier.',
			);
		}
		return;
	}

	async execute(
		command: UpdateCompletedProductScheduleByProductScheduleCompleteCommand,
	): Promise<HttpResponseBodySuccessDto<ProductScheduleEntity> | HttpException> {
		const { productScheduleId, supplierInformation } = command;

		const productSchedule =
			await this.productScheduleRepository.findProductScheduleByProductScheduleId(
				productScheduleId,
			);
		if (
			productSchedule.status === ProductScheduleStatusEnum.canceled ||
			productSchedule.status === ProductScheduleStatusEnum.completed
		) {
			throw new OptionalException(
				HttpStatus.NOT_FOUND,
				'Product schedule canceled or completed.',
			);
		}
		this.checkSupplierPermissions(supplierInformation, productSchedule);

		const productScheduleCompleted =
			await this.productScheduleRepository.updateCompletedProductScheduleByProductScheduleComplete(
				productScheduleId,
			);

		return {
			success: true,
			data: productScheduleCompleted,
		};
	}
}
