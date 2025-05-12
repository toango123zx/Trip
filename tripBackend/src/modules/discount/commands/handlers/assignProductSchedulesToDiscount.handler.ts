import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ProductScheduleStatusEnum } from '@prisma/client';
import {
	ConflictException,
	HttpResponseBodySuccessDto,
	NotFoundException,
	OptionalException,
} from 'src/common';
import { InfoDiscountEntity } from 'src/models';

import { InfoDiscountRepository } from 'src/modules/InfoDiscount/infoDiscount.repository';
import { ProductScheduleRepository } from 'src/modules/productSchedule/productSchedule.repository';

import { DiscountRepository } from '../../discount.repository';
import { AssignProductSchedulesToDiscountCommand } from '../implements';

@CommandHandler(AssignProductSchedulesToDiscountCommand)
export class AssignProductSchedulesToDiscountHandler
	implements ICommandHandler<AssignProductSchedulesToDiscountCommand>
{
	constructor(
		private readonly productScheduleRepository: ProductScheduleRepository,
		private readonly infoDiscountRepository: InfoDiscountRepository,
		private readonly discountRepository: DiscountRepository,
	) {}

	async execute(
		command: AssignProductSchedulesToDiscountCommand,
	): Promise<HttpResponseBodySuccessDto<InfoDiscountEntity[]> | HttpException> {
		const { discountId, productScheduleIds, myInformation } = command;
		const discount =
			await this.discountRepository.findDiscountByDiscountId(discountId);
		if (!discount) {
			throw new NotFoundException('discountId');
		}
		if (discount.userId !== myInformation.id) {
			throw new OptionalException(
				HttpStatus.FORBIDDEN,
				'You are not the owner of this discount',
			);
		}
		const productSchedules =
			await this.productScheduleRepository.findProductSchedulesByProductSchedulesId(
				productScheduleIds,
				ProductScheduleStatusEnum.active,
			);

		if (productSchedules.length !== productScheduleIds.length) {
			throw new NotFoundException('productScheduleId');
		}

		const exist = discount.infoDiscount.find((infoDiscount) =>
			productScheduleIds.includes(infoDiscount.productScheduleId),
		);
		if (exist) {
			throw new ConflictException('productScheduleId');
		}

		const InfoSchedules =
			await this.infoDiscountRepository.createInfoDiscountForProductSchedules(
				discountId,
				productScheduleIds,
			);
		return {
			success: true,
			data: InfoSchedules,
		};
	}
}
