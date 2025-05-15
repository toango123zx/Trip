import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
	ConflictException,
	HttpResponseBodySuccessDto,
	NotFoundException,
} from 'src/common';
import { GetCartResponseDto } from 'src/modules/cart/dtos/responses/getCart.response';

import { CartRepository } from 'src/modules/cart/cart.repository';

import { ProductScheduleRepository } from '../../productSchedule.repository';
import { AddToCartByProductScheduleIdCommand } from '../implements';

@CommandHandler(AddToCartByProductScheduleIdCommand)
export class AddToCartByProductScheduleIdHandler
	implements ICommandHandler<AddToCartByProductScheduleIdCommand>
{
	constructor(
		private readonly productScheduleRepository: ProductScheduleRepository,
		private readonly cartRepository: CartRepository,
	) {}

	async execute(
		command: AddToCartByProductScheduleIdCommand,
	): Promise<HttpResponseBodySuccessDto<GetCartResponseDto> | HttpException> {
		const { productScheduleId, myInformation } = command;

		const productSchedule =
			await this.productScheduleRepository.findProductScheduleByProductScheduleId(
				productScheduleId,
			);
		if (!productSchedule) {
			throw new NotFoundException('productScheduleId');
		}

		const cartExist = await this.cartRepository.getCartByProductScheduleId(
			productScheduleId,
			myInformation.id,
		);
		if (cartExist) {
			throw new ConflictException('productScheduleId');
		}

		const cart = await this.cartRepository.createCart(
			myInformation.id,
			productScheduleId,
		);

		return {
			success: true,
			data: new GetCartResponseDto(cart),
		};
	}
}
