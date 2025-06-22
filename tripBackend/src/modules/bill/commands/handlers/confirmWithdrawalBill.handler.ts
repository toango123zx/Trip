import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
	BillStatusEnum,
	BillWithdrawalInfo,
	TransactionTargetEnum,
} from '@prisma/client';
import {
	ConflictException,
	HttpResponseBodySuccessDto,
	NotFoundException,
	OptionalException,
} from 'src/common';
import { BillEntity } from 'src/models';

import { BillRepository } from '../../bill.repository';
import { ConfirmWithdrawalBillCommand } from '../implements';

@CommandHandler(ConfirmWithdrawalBillCommand)
export class ConfirmWithdrawalBillHandler
	implements ICommandHandler<ConfirmWithdrawalBillCommand>
{
	constructor(private readonly billRepository: BillRepository) {}

	async execute(
		command: ConfirmWithdrawalBillCommand,
	): Promise<HttpResponseBodySuccessDto<BillEntity> | HttpException> {
		const { billId } = command;
		const bill = await this.billRepository.findBillByBillId(billId);
		if (!bill) {
			throw new NotFoundException('Bill not found');
		}
		if (bill.status !== BillStatusEnum.pending) {
			throw new ConflictException('Bill is not in pending status');
		}
		if (bill.transactionTargetId !== TransactionTargetEnum.withdrawal) {
			throw new NotFoundException('Bill not found');
		}

		const billWithdrawal: BillWithdrawalInfo =
			await this.billRepository.findWithdrawalBillByBillId(billId);
		if (billWithdrawal.amount > bill.user.balance) {
			throw new OptionalException(HttpStatus.CONFLICT, 'Insufficient balance');
		}

		const billUpdated = await this.billRepository.updateConfirmWithdrawalBill(
			billId,
			Number(billWithdrawal.amount),
		);

		return {
			success: true,
			data: billUpdated,
		};
	}
}
