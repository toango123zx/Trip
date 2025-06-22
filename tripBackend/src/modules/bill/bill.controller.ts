import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { HttpResponseBodyDto, PaginationDto, PermissionEnum, RoleEnum } from 'src/common';
import { BillEntity } from 'src/models';

import { Auth, AuthPermission, AuthRole } from '../auth/decorators';
import { MyInformation } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import {
	CancelBillByBillIdCommand,
	ConfirmWithdrawalBillCommand,
	CreateBillCommand,
	PaymentBillByBillIdCommand,
	UpdatePaidBillCommand,
} from './commands/implements';
import { CreateWithdrawalBillByUserIdCommand } from './commands/implements/createWithdrawalBillByUserId.command';
import {
	CreateBillRequest,
	BillDetailResponseDto,
	CreateWithdrawalBillRequestDto,
} from './dtos';
import { BillFilterRequestDto } from './dtos/requests/billFilter.request';
import {
	GetBillByBillIdQuery,
	GetBillsByUserIdQuery,
	GetBillsManagementQuery,
} from './queries/implements';

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

	@Get('/management')
	@AuthRole(RoleEnum.Admin)
	async getBillsManagement(
		@Query() pagination: PaginationDto,
		@Query() filter?: BillFilterRequestDto,
	): Promise<HttpResponseBodyDto<BillDetailResponseDto> | HttpException> {
		return this.queryBus.execute(new GetBillsManagementQuery(pagination, filter));
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

	@Post('/:billId/payment')
	@Auth()
	async yaymentBillByBillId(
		@Param('billId') billId: string,
		@MyInformation() myInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<BillDetailResponseDto | HttpException>> {
		return this.commandBus.execute(
			new PaymentBillByBillIdCommand(billId, myInformation),
		);
	}

	@Post('/withdrawal')
	@Auth()
	async createWithdrawalBillByUserId(
		@MyInformation() myInformation: UserInformationDto,
		@Body() withDrawalBillInformation: CreateWithdrawalBillRequestDto,
	): Promise<HttpResponseBodyDto<BillDetailResponseDto | HttpException>> {
		return this.commandBus.execute(
			new CreateWithdrawalBillByUserIdCommand(
				myInformation,
				withDrawalBillInformation,
			),
		);
	}

	@Put('/:billId/withdrawal/confirm')
	@AuthRole(RoleEnum.Admin)
	async confirmWithdrawalBill(
		@Param('billId') billId: string,
		@MyInformation() myInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<BillEntity | HttpException>> {
		return this.commandBus.execute(
			new ConfirmWithdrawalBillCommand(billId, myInformation),
		);
	}

	@Put('/:billId/paid')
	@AuthPermission(PermissionEnum.UpdatePaidBill)
	async updatePaidBill(
		@Param('billId') billId: string,
	): Promise<HttpResponseBodyDto<BillEntity | HttpException>> {
		return this.commandBus.execute(new UpdatePaidBillCommand(billId));
	}

	@Delete('/:billId')
	@Auth()
	async deleteBillByBillId(
		@Param('billId') billId: string,
		@MyInformation() myInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<BillEntity> | HttpException> {
		return this.commandBus.execute(
			new CancelBillByBillIdCommand(billId, myInformation),
		);
	}
}
