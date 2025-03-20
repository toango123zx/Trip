import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';

import { ProductScheduleRepository } from './productSchedule.repository';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [],
	providers: [ProductScheduleRepository],
	exports: [],
})
export class ProductScheduleModule {}
