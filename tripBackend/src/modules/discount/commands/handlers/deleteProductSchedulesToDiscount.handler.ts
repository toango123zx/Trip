import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { InfoDiscountStatusEnum } from '@prisma/client';
import {
	HttpResponseBodySuccessDto,
	NotFoundException,
	OptionalException,
} from 'src/common';
import { DiscountEntity } from 'src/models';

import { InfoDiscountRepository } from 'src/modules/InfoDiscount/infoDiscount.repository';
import { ProductScheduleRepository } from 'src/modules/productSchedule/productSchedule.repository';

import { DiscountRepository } from '../../discount.repository';
import { GetDiscountByDiscountIdResponseDto } from '../../dtos';
import { DeleteProductSchedulesToDiscountCommand } from '../implements';

@CommandHandler(DeleteProductSchedulesToDiscountCommand)
export class DeleteProductSchedulesToDiscountHandler
	implements ICommandHandler<DeleteProductSchedulesToDiscountCommand>
{
	constructor(
		private readonly productScheduleRepository: ProductScheduleRepository,
		private readonly infoDiscountRepository: InfoDiscountRepository,
		private readonly discountRepository: DiscountRepository,
	) {}

	async execute(
		command: DeleteProductSchedulesToDiscountCommand,
	): Promise<
		HttpResponseBodySuccessDto<GetDiscountByDiscountIdResponseDto> | HttpException
	> {
		const { discountId, productScheduleIds, myInformation } = command;
		const discount = await this.discountRepository.findDiscountByDiscountId(
			discountId,
			InfoDiscountStatusEnum.active,
		);
		if (!discount) {
			throw new NotFoundException('discountId');
		}
		if (discount.userId !== myInformation.id) {
			throw new OptionalException(
				HttpStatus.FORBIDDEN,
				'You are not the owner of this discount',
			);
		}

		const infoDiscount = discount.infoDiscount.filter((item) =>
			productScheduleIds.includes(item.productScheduleId),
		);
		if (infoDiscount.length !== productScheduleIds.length) {
			throw new NotFoundException('productScheduleId');
		}

		const infoSchedules =
			await this.infoDiscountRepository.deleteInfoDiscountForProductSchedules(
				discountId,
				productScheduleIds,
			);
		const updateDiscount: DiscountEntity = {
			...discount,
			infoDiscount: infoSchedules,
		};
		return {
			success: true,
			data: new GetDiscountByDiscountIdResponseDto(updateDiscount),
		};
	}
}
