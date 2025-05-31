import { HttpException, HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
	BillStatusEnum,
	TransactionStatusEnum,
	TransactionTargetEnum,
} from '@prisma/client';
import {
	HttpResponseBodySuccessDto,
	NotFoundException,
	OptionalException,
} from 'src/common';
import { vnpay } from 'src/configs';
import { BillEntity, CreateTransactionDto } from 'src/models';
import { parseDate } from 'vnpay';

import { TransactionSessionRepository } from 'src/modules/transactionSession/transactionSession.repository';

import { TransactionRepository } from '../../transaction.repository';
import { CheckBillPaymentByVnpayQuery } from '../implements';

@QueryHandler(CheckBillPaymentByVnpayQuery)
export class CheckBillPaymentByVnpayHandler
	implements IQueryHandler<CheckBillPaymentByVnpayQuery>
{
	constructor(
		private readonly transactionSessionRepository: TransactionSessionRepository,
		private readonly transactionRepository: TransactionRepository,
	) {}

	async execute(
		query: CheckBillPaymentByVnpayQuery,
	): Promise<HttpResponseBodySuccessDto<BillEntity> | HttpException> {
		const { verifyIpn } = query;
		const transactionSession =
			await this.transactionSessionRepository.findTransactionSession(
				verifyIpn.vnp_TxnRef,
				BillStatusEnum.pending,
			);
		try {
			if (verifyIpn.vnp_TmnCode !== vnpay.defaultConfig.vnp_TmnCode) {
				throw new OptionalException(
					HttpStatus.UNPROCESSABLE_ENTITY,
					'Invalid transaction',
				);
			}

			if (verifyIpn.vnp_ResponseCode !== '00') {
				throw new OptionalException(
					HttpStatus.UNPROCESSABLE_ENTITY,
					'Transaction is not verified',
				);
			}

			if (verifyIpn.vnp_TransactionStatus !== '00') {
				throw new OptionalException(
					HttpStatus.UNPROCESSABLE_ENTITY,
					'Transaction is not success',
				);
			}

			if (!transactionSession) {
				throw new NotFoundException('transactionSessionId for payment');
			}

			if (
				Number(verifyIpn.vnp_Amount) / 100 !==
				transactionSession.bill.totalPrice -
					transactionSession.bill.reductionPrice
			) {
				throw new OptionalException(
					HttpStatus.UNPROCESSABLE_ENTITY,
					'Transaction amount is not correct',
				);
			}

			const transaction: CreateTransactionDto = {
				amount: Number(verifyIpn.vnp_Amount),
				bankCode: verifyIpn.vnp_BankCode,
				BankTransactionCode: verifyIpn.vnp_BankTranNo,
				cardType: verifyIpn.vnp_CardType,
				description: verifyIpn.vnp_OrderInfo,
				transactionCode: String(verifyIpn.vnp_TransactionNo),
				transactionSessionCode: verifyIpn.vnp_TxnRef,
				transactionTarget: TransactionTargetEnum.pay,
				paymentMethod: {
					connect: {
						id: transactionSession.paymentMethod.id,
					},
				},
				bill: {
					connect: {
						id: transactionSession.bill.id,
					},
				},
				createAt: parseDate(verifyIpn.vnp_PayDate),
				status: TransactionStatusEnum.completed,
			};

			const transactionCreated =
				await this.transactionRepository.createTransactionSuccess(transaction);

			return {
				success: true,
				data: transactionCreated.bill,
			};
		} catch (error) {
			await this.transactionSessionRepository.deleteTranasactionSession(
				transactionSession.id,
			);
			throw {
				message: error,
				data: transactionSession.bill,
			};
		}
	}
}
