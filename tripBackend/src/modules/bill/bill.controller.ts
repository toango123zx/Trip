import { Body, Controller, Get, HttpException, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { HttpResponseBodyDto, PaginationDto } from 'src/common';
import { BillEntity } from 'src/models';

import { Auth } from '../auth/decorators';
import { MyInformation } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import { CreateBillCommand } from './commands/implements';
import { CreateBillRequest, BillDetailResponseDto } from './dtos';
import { BillFilterRequestDto } from './dtos/requests/billFilter.request';
import { GetBillByBillIdQuery, GetBillsByUserIdQuery } from './queries/implements';

@Controller('bill')
export class BillController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Get()
	@Auth()
	async getBillsByUserId(
		@Query() pagination: PaginationDto,
		@MyInformation() myInformation: UserInformationDto,
		@Query() filter?: BillFilterRequestDto,
	): Promise<HttpResponseBodyDto<BillEntity[]>> {
		return this.queryBus.execute(
			new GetBillsByUserIdQuery(pagination, myInformation, filter),
		);
	}

	@Get('/:billId')
	@Auth()
	async getBillByBillId(
		@Param('billId') billId: string,
		@MyInformation() myInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<BillDetailResponseDto> | HttpException> {
		return this.queryBus.execute(new GetBillByBillIdQuery(billId, myInformation));
	}

	@Post()
	@Auth()
	async createBill(
		@MyInformation() myInformation: UserInformationDto,
		@Body() billInformation: CreateBillRequest,
	): Promise<HttpResponseBodyDto<BillDetailResponseDto | HttpException>> {
		return this.commandBus.execute(
			new CreateBillCommand(myInformation, billInformation),
		);
	}
}
