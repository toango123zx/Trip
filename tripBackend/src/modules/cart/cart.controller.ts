import { Controller, Delete, Get, HttpException, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { PaginationDto, HttpResponseBodyDto } from 'src/common';

import { Auth } from '../auth/decorators';
import { MyInformation } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import { DeleteScheduleInCartCommand } from './commands/implements';
import { CartFilterRequestDto } from './dtos';
import { GetCartResponseDto } from './dtos/responses/getCart.response';
import { GetCartByUserIdQuery } from './queries/implements';

@Controller('cart')
export class CartController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Get()
	@Auth()
	async getCartByUserId(
		@Query() pagination: PaginationDto,
		@MyInformation() myInformation: UserInformationDto,
		@Query() search?: CartFilterRequestDto,
	): Promise<HttpResponseBodyDto<GetCartResponseDto[]>> {
		return this.queryBus.execute(
			new GetCartByUserIdQuery(pagination, myInformation, search),
		);
	}

	@Delete('/:cartId')
	@Auth()
	async deleteScheduleInCart(
		@Param('cartId') cartId: string,
		@MyInformation() myInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<GetCartResponseDto> | HttpException> {
		return this.commandBus.execute(
			new DeleteScheduleInCartCommand(cartId, myInformation),
		);
	}
}
