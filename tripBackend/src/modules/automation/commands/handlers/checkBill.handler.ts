import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BillStatusEnum, SystemCheckServiceEnum } from '@prisma/client';

import { BillRepository } from 'src/modules/bill/bill.repository';

import { AutomationRepository } from '../../automation.repository';
import { CheckBillCommand } from '../implements';

@CommandHandler(CheckBillCommand)
export class CheckBillHandler implements ICommandHandler<CheckBillCommand> {
	constructor(
		private readonly billRepository: BillRepository, // Inject any required dependencies here
		private readonly automationRepository: AutomationRepository,
	) {}
	async execute(): Promise<void> {
		const latestCheck =
			await this.automationRepository.findLatestCheckedServicesByServiceName(
				SystemCheckServiceEnum.bill,
			);

		const [bills, totalRecords] =
			await this.automationRepository.findCheckBillByCreateAt(
				latestCheck[0]?.createdAt,
				[BillStatusEnum.pending],
			);
		if (totalRecords === 0) {
			return;
		}

		for (const bill of bills) {
			await this.billRepository.cancelBillByBillId(bill.id);
		}
		return;
	}
}
