import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { BillRepository } from '../bill/bill.repository';
import { DatabaseModule } from '../database/database.module';
import { DiscountRepository } from '../discount/discount.repository';

import { AutomationRepository } from './automation.repository';
import { AutomationCommandHandlers } from './commands/handlers';
import { AutomationService } from './services';

@Module({
	imports: [CqrsModule, DatabaseModule],
	providers: [
		BillRepository,
		DiscountRepository,
		AutomationRepository,
		AutomationService,
		...AutomationCommandHandlers,
	],
})
export class AutomationModule {}
