import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { SupplierRepository } from '../supplier/supplier.repository';
import { UserRepository } from '../user/user.repository';

import { StatisticQueryHandlers } from './queries/handlers';
import { StatisticController } from './statistic.controller';
import { StatisticRepository } from './statistic.repositroy';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [StatisticController],
	providers: [
		UserRepository,
		SupplierRepository,
		StatisticRepository,
		...StatisticQueryHandlers,
	],
	exports: [],
})
export class StatisticModule {}
