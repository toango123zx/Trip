import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BillStatusEnum } from '@prisma/client';
import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';
import { BillEntity } from 'src/models';

import { UpdatePaidBillCommand } from '../implements';

import { BillRepository } from './../../bill.repository';

@CommandHandler(UpdatePaidBillCommand)
export class UpdatePaidBillHandler implements ICommandHandler<UpdatePaidBillCommand> {
	constructor(private readonly BillRepository: BillRepository) {}

	async execute(
		command: UpdatePaidBillCommand,
	): Promise<HttpResponseBodySuccessDto<BillEntity> | HttpException> {
		const { billId } = command;

		const bill = await this.BillRepository.findBillByBillId(billId);

		if (!bill || bill.status !== BillStatusEnum.pending) {
			throw new NotFoundException('billId');
		}

		const updatedBill = await this.BillRepository.updatePaidBill(billId);

		return {
			success: true,
			data: updatedBill,
		};
	}
}
