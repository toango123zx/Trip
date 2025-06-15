import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CheckBillCommand, CheckDiscountCommand } from '../commands/implements';

@Injectable()
export class AutomationService {
	constructor(private commandBus: CommandBus) {}

	@Cron('0 */4 * * *')
	async checkBill() {
		await this.commandBus.execute(new CheckBillCommand());
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async checkDiscount() {
		await this.commandBus.execute(new CheckDiscountCommand());
	}
}
