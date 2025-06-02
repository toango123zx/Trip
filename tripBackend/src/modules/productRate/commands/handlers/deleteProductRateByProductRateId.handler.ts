import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ProductRateStatusEnum } from '@prisma/client';
import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';

import { ProductRateRepository } from 'src/modules/productRate/productRate.repository';

import { GetProductRatesResponseDto } from '../../dto/responses';
import { DeleteProductRateByProductRateIdCommand } from '../implements';

@CommandHandler(DeleteProductRateByProductRateIdCommand)
export class DeleteProductRateByProductRateIdHandler
	implements ICommandHandler<DeleteProductRateByProductRateIdCommand>
{
	constructor(private readonly productRateRepository: ProductRateRepository) {}
	async execute(
		command: DeleteProductRateByProductRateIdCommand,
	): Promise<HttpResponseBodySuccessDto<GetProductRatesResponseDto> | HttpException> {
		const productRate =
			await this.productRateRepository.findProductRateByProductRateId(
				command.productRateId,
			);

		if (!productRate || productRate.status === ProductRateStatusEnum.removed) {
			throw new NotFoundException('productRateId');
		}

		const productAvgRate =
			(productRate.product.avgRate * productRate.product.quantityRate -
				productRate.star) /
			(productRate.product.quantityRate - 1);

		const productRateDeleted =
			await this.productRateRepository.updateDeleteProductRate(
				productRate.id,
				productAvgRate,
			);

		return {
			success: true,
			data: new GetProductRatesResponseDto(productRateDeleted),
		};
	}
}
