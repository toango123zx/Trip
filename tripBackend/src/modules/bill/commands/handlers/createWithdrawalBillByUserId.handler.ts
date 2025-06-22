import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, OptionalException } from 'src/common';

import { PaymentMethodRepository } from 'src/modules/paymentMethod/paymentMethod.repository';
import { TransactionSessionRepository } from 'src/modules/transactionSession/transactionSession.repository';

import { BillRepository } from '../../bill.repository';
import { CreateWithdrawalBillByUserIdCommand } from '../implements/createWithdrawalBillByUserId.command';

@CommandHandler(CreateWithdrawalBillByUserIdCommand)
export class CreateWithdrawalBillByUserIdHandler
	implements ICommandHandler<CreateWithdrawalBillByUserIdCommand>
{
	constructor(
		private readonly billRepository: BillRepository,
		private readonly paymentMethodRepository: PaymentMethodRepository,
		private readonly transactionSessionRepository: TransactionSessionRepository,
	) {}

	async execute(
		command: CreateWithdrawalBillByUserIdCommand,
	): Promise<HttpResponseBodySuccessDto<boolean> | HttpException> {
		const { withDrawalBillInformation, myInformation } = command;
		if (myInformation.balance < withDrawalBillInformation.amount) {
			throw new OptionalException(HttpStatus.CONFLICT, 'Insufficient balance');
		}
		await this.billRepository.createWithdrawalBill(
			withDrawalBillInformation.bankName,
			withDrawalBillInformation.bankCode,
			withDrawalBillInformation.amount,
			myInformation.id,
		);
		return {
			success: true,
			data: true,
		};
	}
}
