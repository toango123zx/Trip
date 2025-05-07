import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ProductScheduleStatusEnum } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { HttpResponseBodySuccessDto, OptionalException } from 'src/common';
import { ProductScheduleEntity } from 'src/models';
import { SupplierInformationDto } from 'src/modules/supplier/dtos';

import { DeleteProductScheduleByProductScheduleIdResponseDto } from '../../dtos';
import { ProductScheduleRepository } from '../../productSchedule.repository';
import { DeleteProductScheduleByProductScheduleIdCommand } from '../implements';

@CommandHandler(DeleteProductScheduleByProductScheduleIdCommand)
export class DeleteProductScheduleByProductScheduleIdHandler
	implements ICommandHandler<DeleteProductScheduleByProductScheduleIdCommand>
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
		command: DeleteProductScheduleByProductScheduleIdCommand,
	): Promise<
		| HttpResponseBodySuccessDto<DeleteProductScheduleByProductScheduleIdResponseDto>
		| HttpException
	> {
		const { productScheduleId, supplierInformation } = command;

		const productSchedule =
			await this.productScheduleRepository.findProductScheduleByProductScheduleId(
				productScheduleId,
			);
		if (productSchedule.status === ProductScheduleStatusEnum.canceled) {
			throw new OptionalException(
				HttpStatus.NOT_FOUND,
				'Product schedule canceled.',
			);
		}
		this.checkSupplierPermissions(supplierInformation, productSchedule);
		const [productScheduleCanceled] =
			await this.productScheduleRepository.deleteProductScheduleByProductScheduleId(
				productScheduleId,
			);

		return {
			success: true,
			data: new DeleteProductScheduleByProductScheduleIdResponseDto(
				productScheduleCanceled,
			),
		};
	}
}
