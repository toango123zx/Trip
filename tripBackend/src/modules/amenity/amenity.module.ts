import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { AmenityRepository } from './amenity.repository';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [],
	providers: [AmenityRepository],
	exports: [],
})
export class AmenityModule {}
