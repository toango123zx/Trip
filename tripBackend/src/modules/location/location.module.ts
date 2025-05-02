import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { LocationController } from './location.controller';
import { LocationRepository } from './location.repository';
import { LocationQueryHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [LocationController],
	providers: [LocationRepository, ...LocationQueryHandlers],
	exports: [],
})
export class LocationModule {}
