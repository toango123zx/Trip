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
import { HttpResponseBodyDto, PaginationDto, PermissionEnum } from 'src/common';
import { DiscountEntity, ProductScheduleEntity } from 'src/models';

import { AuthPermission } from '../auth/decorators';
import { ProductScheduleFilterRequestDto } from '../productSchedule/dtos';
import { MyInformation } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import {
	AssignProductSchedulesToDiscountCommand,
	CreateDiscountCommand,
	DeleteDiscountByDiscountIdCommand,
} from './commands/implements';
import {
	AssignProductSchedulesToDiscountRequestDto,
	CreateDiscountRequestDto,
	DiscountFilterRequestDto,
	GetDiscountByDiscountIdResponseDto,
} from './dtos';
import {
	GetDiscountByDiscountIdQuery,
	GetDiscountsByUserIdQuery,
	GetNonDiscountableSchedulesQuery,
} from './queries/implements';

@Controller('discount')
export class DiscountController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Get()
	@AuthPermission(PermissionEnum.FindDiscountsByUserId)
	async getDiscounts(
		@Query() pagination: PaginationDto,
		@MyInformation() myInformation: UserInformationDto,
		@Query() search?: DiscountFilterRequestDto,
	): Promise<HttpResponseBodyDto<DiscountEntity[] | HttpException>> {
		return this.queryBus.execute(
			new GetDiscountsByUserIdQuery(pagination, myInformation, search),
		);
	}

	@Get('/:discountId')
	async getDiscountByDiscountId(
		@Param('discountId') discountId: string,
		@Query() status?: DiscountStatusEnum,
	): Promise<HttpResponseBodyDto<GetDiscountByDiscountIdResponseDto | HttpException>> {
		return this.queryBus.execute(
			new GetDiscountByDiscountIdQuery(discountId, status),
		);
	}

	@Get('/:discountId/:productId/nonDiscountableSchedules/')
	@AuthPermission(PermissionEnum.AsignProductSchedulesToDiscount)
	async getNonDiscountableSchedules(
		@Param('discountId') discountId: string,
		@Param('productId') productId: string,
		@Query() pagination: PaginationDto,
		@MyInformation() myInformation: UserInformationDto,
		@Query() filter?: ProductScheduleFilterRequestDto,
	): Promise<HttpResponseBodyDto<ProductScheduleEntity[]> | HttpException> {
		return this.queryBus.execute(
			new GetNonDiscountableSchedulesQuery(
				discountId,
				productId,
				pagination,
				myInformation,
				filter,
			),
		);
	}

	@Post()
	@AuthPermission(PermissionEnum.CreateDiscount)
	async createDiscount(
		@Body() discountInformation: CreateDiscountRequestDto,
		@MyInformation() myInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<GetDiscountByDiscountIdResponseDto | HttpException>> {
		return this.commandBus.execute(
			new CreateDiscountCommand(discountInformation, myInformation),
		);
	}

	@Post('/:discountId/assign-schedules/')
	@AuthPermission(PermissionEnum.AsignProductSchedulesToDiscount)
	async assignProductSchedulesToDiscount(
		@Param('discountId') discountId: string,
		@Body()
		assignProductSchedulesToDiscount: AssignProductSchedulesToDiscountRequestDto,
		@MyInformation() myInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<DiscountEntity | HttpException>> {
		return this.commandBus.execute(
			new AssignProductSchedulesToDiscountCommand(
				discountId,
				assignProductSchedulesToDiscount.scheduleIds,
				myInformation,
			),
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
