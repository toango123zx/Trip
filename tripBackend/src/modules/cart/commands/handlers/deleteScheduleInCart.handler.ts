import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';

import { CartRepository } from 'src/modules/cart/cart.repository';

import { GetCartResponseDto } from '../../dtos/responses/getCart.response';
import { DeleteScheduleInCartCommand } from '../implements/deleteScheduleInCart.command';

@CommandHandler(DeleteScheduleInCartCommand)
export class DeleteScheduleInCartHandler
	implements ICommandHandler<DeleteScheduleInCartCommand>
{
	constructor(private readonly cartRepository: CartRepository) {}

	async execute(
		command: DeleteScheduleInCartCommand,
	): Promise<HttpResponseBodySuccessDto<GetCartResponseDto> | HttpException> {
		const { cardId, myInformation } = command;
		const cart = await this.cartRepository.getCartByCartId(cardId, myInformation.id);
		if (!cart) {
			throw new NotFoundException('cartId');
		}

		const cardDeleted = await this.cartRepository.deleteCart(
			cardId,
			myInformation.id,
		);
		return {
			success: true,
			data: new GetCartResponseDto(cardDeleted),
		};
	}
}
