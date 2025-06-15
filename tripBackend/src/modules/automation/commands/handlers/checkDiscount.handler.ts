import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DiscountStatusEnum, SystemCheckServiceEnum } from '@prisma/client';

import { DiscountRepository } from 'src/modules/discount/discount.repository';

import { AutomationRepository } from '../../automation.repository';
import { CheckDiscountCommand } from '../implements';

@CommandHandler(CheckDiscountCommand)
export class CheckDiscountHandler implements ICommandHandler<CheckDiscountCommand> {
	constructor(
		private readonly discountRepository: DiscountRepository,
		private readonly automationRepository: AutomationRepository,
	) {}
	async execute(): Promise<void> {
		const latestCheck =
			await this.automationRepository.findLatestCheckedServicesByServiceName(
				SystemCheckServiceEnum.bill,
			);

		const [discounts, totalRecords] =
			await this.automationRepository.findCheckDiscountByCreateAt(
				latestCheck[0]?.createdAt,
				[DiscountStatusEnum.active, DiscountStatusEnum.full],
			);
		if (totalRecords === 0) {
			return;
		}

		for (const discount of discounts) {
			await this.discountRepository.expiredDiscountByDiscountId(discount.id);
		}
		return;
	}
}
