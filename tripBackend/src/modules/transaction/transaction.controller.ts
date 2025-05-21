import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { HttpResponseBodyDto } from 'src/common';
import { TransactionEntity } from 'src/models';
import { VerifyIpnCall } from 'vnpay';

import { CheckBillPaymentByVnpayQuery } from './queries/implements';

@Controller('transaction')
export class TransactionController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('/vnpay-bill-payment')
	async verifyVnpayPayment(
		@Query() verifyIpn: VerifyIpnCall,
	): Promise<HttpResponseBodyDto<TransactionEntity> | HttpException> {
		return this.queryBus.execute(new CheckBillPaymentByVnpayQuery(verifyIpn));
	}
}
