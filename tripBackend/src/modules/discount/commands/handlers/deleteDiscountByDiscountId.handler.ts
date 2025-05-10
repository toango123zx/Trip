import { HttpException } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';

import { DiscountStatusEnum } from '@prisma/client';
import {
	ForbiddenException,
	HttpResponseBodySuccessDto,
	NotFoundException,
} from 'src/common';

import { DiscountRepository } from '../../discount.repository';
import { GetDiscountByDiscountIdResponseDto } from '../../dtos';
import { DeleteDiscountByDiscountIdCommand } from '../implements';

export class DeleteDiscountByDiscountIdHandler
	implements ICommandHandler<DeleteDiscountByDiscountIdCommand>
{
	constructor(private readonly discountRepository: DiscountRepository) {}

	async execute(
		command: DeleteDiscountByDiscountIdCommand,
	): Promise<
		HttpResponseBodySuccessDto<GetDiscountByDiscountIdResponseDto> | HttpException
	> {
		const { discountId, myInformation } = command;
		const discount =
			await this.discountRepository.findDiscountByDiscountId(discountId);

		if (!discount || discount.status === DiscountStatusEnum.canceled) {
			throw new NotFoundException('discountId');
		}

		if (
			discount.userId !== myInformation.id &&
			!myInformation.roleName.includes('admin')
		) {
			throw new ForbiddenException();
		}

		const discountDeleted =
			await this.discountRepository.deleteDiscountByDiscountId(discountId);

		return {
			success: true,
			data: new GetDiscountByDiscountIdResponseDto(discountDeleted),
		};
	}
}
