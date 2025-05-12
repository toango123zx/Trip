import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';

import { ProductScheduleController } from './productSchedule.controller';
import { ProductScheduleRepository } from './productSchedule.repository';
import { productScheduleCommandHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [ProductScheduleController],
	providers: [ProductScheduleRepository, ...productScheduleCommandHandlers],
	exports: [],
})
export class ProductScheduleModule {}
