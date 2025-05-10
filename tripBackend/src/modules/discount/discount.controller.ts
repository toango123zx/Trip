import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	Param,
	Post,
	Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { DiscountStatusEnum } from '@prisma/client';
import { HttpResponseBodyDto, PermissionEnum } from 'src/common';
import { DiscountEntity } from 'src/models';

import { AuthPermission } from '../auth/decorators';
import { MyInformation } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import {
	CreateDiscountCommand,
	DeleteDiscountByDiscountIdCommand,
} from './commands/implements';
import { CreateDiscountRequestDto, GetDiscountByDiscountIdResponseDto } from './dtos';
import { GetDiscountByDiscountIdQuery } from './queries/implements';

@Controller('discount')
export class DiscountController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Get('/:discountId')
	async getDiscountByDiscountId(
		@Param('discountId') discountId: string,
		@Query() status?: DiscountStatusEnum,
	): Promise<HttpResponseBodyDto<GetDiscountByDiscountIdResponseDto | HttpException>> {
		return this.queryBus.execute(
			new GetDiscountByDiscountIdQuery(discountId, status),
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

	@Delete('/:discountId')
	@AuthPermission(PermissionEnum.DeleteDiscountByDiscountId)
	async deleteDiscountByDiscountId(
		@Param('discountId') discountId: string,
		@MyInformation() myInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<GetDiscountByDiscountIdResponseDto>> {
		return this.commandBus.execute(
			new DeleteDiscountByDiscountIdCommand(discountId, myInformation),
		);
	}
}
