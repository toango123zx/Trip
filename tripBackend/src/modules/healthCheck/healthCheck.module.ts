import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { QueryHandlers } from './queries/handlers';

import { HealthCheckController } from './healthCheck.controller';
import { DatabaseModule } from '../database/database.module';
import { HealthCheckRepository } from './healthCheck.repository';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [HealthCheckController],
	providers: [...QueryHandlers, HealthCheckRepository],
})
export class HealthCheckModule {}
