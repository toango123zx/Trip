import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { HealthCheckController } from './healthCheck.controller';
import { HealthCheckRepository } from './healthCheck.repository';
import { QueryHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [HealthCheckController],
	providers: [...QueryHandlers, HealthCheckRepository],
})
export class HealthCheckModule {}
