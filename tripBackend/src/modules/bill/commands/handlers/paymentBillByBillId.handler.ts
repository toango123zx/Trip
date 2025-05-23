import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BillStatusEnum, PaymentMethodStatusEnum } from '@prisma/client';
import {
	ForbiddenException,
	HttpResponseBodySuccessDto,
	NotFoundException,
	OptionalException,
	PaymentMethodEnum,
} from 'src/common';
import { vnpay } from 'src/configs';
import { CreateTransactionSessionDto } from 'src/models';
import { ProductCode, VnpLocale, dateFormat } from 'vnpay';

import { PaymentMethodRepository } from 'src/modules/paymentMethod/paymentMethod.repository';
import { TransactionSessionRepository } from 'src/modules/transactionSession/transactionSession.repository';

import { BillRepository } from '../../bill.repository';
import { PaymentBillByBillIdCommand } from '../implements';

@CommandHandler(PaymentBillByBillIdCommand)
export class PaymentBillByBillIdHandler
	implements ICommandHandler<PaymentBillByBillIdCommand> {
	constructor(
		private readonly billRepository: BillRepository,
		private readonly paymentMethodRepository: PaymentMethodRepository,
		private readonly transactionSessionRepository: TransactionSessionRepository,
	) { }

	async execute(
		command: PaymentBillByBillIdCommand,
	): Promise<HttpResponseBodySuccessDto<string> | HttpException> {
		const { billId, myInformation } = command;

		const bill = await this.billRepository.findBillByBillId(billId);
		if (!bill || bill.status !== BillStatusEnum.pending) {
			throw new NotFoundException('billId for payment');
		}
		if (bill.userId !== myInformation.id) {
			throw new ForbiddenException();
		}

		const paymentMethod =
			await this.paymentMethodRepository.getPaymentMethodByPaymentMethodName(
				PaymentMethodEnum.vnpay,
				PaymentMethodStatusEnum.active,
			);

		if (!paymentMethod) {
			throw new OptionalException(
				HttpStatus.SERVICE_UNAVAILABLE,
				'This payment method is currently unavailable.',
			);
		}
		const transactionSession: CreateTransactionSessionDto = {
			bill: {
				connect: {
					id: bill.id,
				},
			},
			paymentMethod: {
				connect: {
					id: paymentMethod.id,
				},
			},
		};

		const transactionSessionCreated =
			await this.transactionSessionRepository.createTransactionSession(
				transactionSession,
			);

		const expireDate = new Date();
		expireDate.setDate(expireDate.getMilliseconds() + 15);

		const paymentUrl = vnpay.buildPaymentUrl({
			vnp_Amount: bill.totalPrice - bill.reductionPrice,
			vnp_IpAddr: '127.0.0.1',
			vnp_TxnRef: transactionSessionCreated.id,
			vnp_OrderInfo: `Pay order ${bill.id} with the amount of ${bill.totalPrice - bill.reductionPrice}.`,
			vnp_OrderType: ProductCode.Hotel_Tourism,
			vnp_ReturnUrl: 'http://localhost:3000/transaction/vnpay-bill-payment',
			vnp_Locale: VnpLocale.VN,
			vnp_CreateDate: dateFormat(new Date()),
			vnp_ExpireDate: dateFormat(expireDate),
		});
		return {
			success: true,
			data: paymentUrl,
		};
	}
}
