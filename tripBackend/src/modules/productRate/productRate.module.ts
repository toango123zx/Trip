import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { SupplierRepository } from '../supplier/supplier.repository';

import { UserRepository } from './../user/user.repository';
import { ProductRateCommandHandlers } from './commands/handlers';
import { ProductRateController } from './productRate.controller';
import { ProductRateRepository } from './productRate.repository';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [ProductRateController],
	providers: [
		UserRepository,
		SupplierRepository,
		ProductRateRepository,
		...ProductRateCommandHandlers,
	],
	exports: [],
})
export class ProductRateModule {}
