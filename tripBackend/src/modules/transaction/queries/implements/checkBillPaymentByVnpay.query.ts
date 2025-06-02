import { IQuery } from '@nestjs/cqrs';

import { VerifyIpnCall } from 'vnpay';

export class CheckBillPaymentByVnpayQuery implements IQuery {
	constructor(public readonly verifyIpn: VerifyIpnCall) {}
}
