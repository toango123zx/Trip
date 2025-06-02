import { Controller, Get, Query, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { Response } from 'express';
import { HttpResponseBodySuccessDto } from 'src/common';
import { BillEntity } from 'src/models';
import { VerifyIpnCall } from 'vnpay';

import { CheckBillPaymentByVnpayQuery } from './queries/implements';

@Controller('transaction')
export class TransactionController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('/vnpay-bill-payment')
	async verifyVnpayPayment(
		@Query() verifyIpn: VerifyIpnCall,
		@Res() res: Response,
	): Promise<void> {
		try {
			const response: HttpResponseBodySuccessDto<BillEntity> =
				await this.queryBus.execute(new CheckBillPaymentByVnpayQuery(verifyIpn));
			const bill: BillEntity = response.data;
			return res.redirect(
				`http://localhost:5173/bills/payment?status=success&billId=${bill.id}&amount=${bill.totalPrice - bill.reductionPrice}&createAt=${bill.createAt.toString()}`,
			);
		} catch (error) {
			return res.redirect(
				`http://localhost:5173/bills/payment?status=fail&billId=${error.data.bill.id}&amount=${error.data.bill.totalPrice - error.data.bill.reductionPrice}&createAt=${error.data.bill.createAt.toString()}`,
			);
		}
	}
}
