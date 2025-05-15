import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { Auth } from '../auth/decorators';
import { MyInformation } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import { GetBillByBillIdQuery } from './queries/implements';

@Controller('bill')
export class BillController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('/:billId')
	@Auth()
	async getBillByBillId(
		@Param('billId') billId: string,
		@MyInformation() myInformation: UserInformationDto,
	) {
		return this.queryBus.execute(new GetBillByBillIdQuery(billId, myInformation));
	}
}
