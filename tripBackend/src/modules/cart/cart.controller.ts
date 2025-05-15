import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { PaginationDto, HttpResponseBodyDto } from 'src/common';

import { Auth } from '../auth/decorators';
import { MyInformation } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import { CartFilterRequestDto } from './dtos';
import { GetCartResponseDto } from './dtos/responses/getCart.response';
import { GetCartByUserIdQuery } from './queries/implements';

@Controller('cart')
export class CartController {
	constructor(private readonly queryBus: QueryBus) {}

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
}
