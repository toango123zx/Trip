import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { CartRepository } from '../cart/cart.repository';
import { DatabaseModule } from '../database/database.module';
import { SupplierRepository } from '../supplier/supplier.repository';
import { UserRepository } from '../user/user.repository';

import { productScheduleCommandHandlers } from './commands/handlers';
import { ProductScheduleController } from './productSchedule.controller';
import { ProductScheduleRepository } from './productSchedule.repository';
import { productScheduleQueryHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [ProductScheduleController],
	providers: [
		ProductScheduleRepository,
		UserRepository,
		SupplierRepository,
		CartRepository,
		...productScheduleQueryHandlers,
		...productScheduleCommandHandlers,
	],
	exports: [],
})
export class ProductScheduleModule {}
