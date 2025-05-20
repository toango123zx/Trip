import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BillStatusEnum } from '@prisma/client';
import { HttpResponseBodySuccessDto, OptionalException, RoleEnum } from 'src/common';
import { BillEntity } from 'src/models';

import { CancelBillByBillIdCommand } from '../implements';

import { BillRepository } from './../../bill.repository';

@CommandHandler(CancelBillByBillIdCommand)
export class CancelBillByBillIdHandler
	implements ICommandHandler<CancelBillByBillIdCommand>
{
	constructor(private readonly BillRepository: BillRepository) {}

	async execute(
		command: CancelBillByBillIdCommand,
	): Promise<HttpResponseBodySuccessDto<BillEntity> | HttpException> {
		const { billId, myInformation } = command;

		const bill = await this.BillRepository.findBillByBillId(billId);

		if (
			!bill ||
			bill.status === BillStatusEnum.cancel ||
			bill.status === BillStatusEnum.done
		) {
			throw new OptionalException(
				HttpStatus.CONFLICT,
				'Bill already canceled or done.',
			);
		}

		if (
			bill.userId !== myInformation.id &&
			myInformation.roleName !== RoleEnum.Admin
		) {
			throw new OptionalException(
				HttpStatus.FORBIDDEN,
				'You do not have permission to cancel this bill.',
			);
		}

		const billCancelled = await this.BillRepository.cancelBillByBillId(billId);

		return {
			success: true,
			data: billCancelled,
		};
	}
}
