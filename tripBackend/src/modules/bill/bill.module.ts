import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { DiscountRepository } from '../discount/discount.repository';
import { PaymentMethodRepository } from '../paymentMethod/paymentMethod.repository';
import { ProductScheduleRepository } from '../productSchedule/productSchedule.repository';
import { SupplierRepository } from '../supplier/supplier.repository';
import { UserRepository } from '../user/user.repository';

import { BillController } from './bill.controller';
import { BillRepository } from './bill.repository';
import { BillCommandHandlers } from './commands/handlers';
import { BillQueryHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [BillController],
	providers: [
		UserRepository,
		SupplierRepository,
		ProductScheduleRepository,
		PaymentMethodRepository,
		DiscountRepository,
		BillRepository,
		...BillQueryHandlers,
		...BillCommandHandlers,
	],
	exports: [],
})
export class BillModule {}
