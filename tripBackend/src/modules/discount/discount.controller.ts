import { Body, Controller, Get, HttpException, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { HttpResponseBodyDto, PaginationDto, PermissionEnum } from 'src/common';
import { DiscountEntity } from 'src/models';

import { AuthPermission } from '../auth/decorators';
import { MyInformation } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import { CreateDiscountCommand } from './commands/implements';
import {
	CreateDiscountRequestDto,
	DiscountFilterRequestDto,
	GetDiscountsByProductIdResponseDto,
} from './dtos';
import { GetDiscountsByProductIdQuery } from './queries/implements';

@Controller('discount')
export class DiscountController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Get('/:productId')
	async getDiscountsByProductId(
		@Param('productId') productId: string,
		@Query() pagination: PaginationDto,
		@Query() search?: DiscountFilterRequestDto,
	): Promise<HttpResponseBodyDto<GetDiscountsByProductIdResponseDto[]>> {
		return this.queryBus.execute(
			new GetDiscountsByProductIdQuery(productId, pagination, search),
		);
	}

	@Post()
	@AuthPermission(PermissionEnum.CreateDiscount)
	async createDiscount(
		@Body() discountInformation: CreateDiscountRequestDto,
		@MyInformation() myInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<DiscountEntity | HttpException>> {
		return this.commandBus.execute(
			new CreateDiscountCommand(discountInformation, myInformation),
		);
	}
}
