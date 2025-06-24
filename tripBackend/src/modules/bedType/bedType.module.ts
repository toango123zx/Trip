import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { BedTypeRepository } from './bedType.repository';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [],
	providers: [BedTypeRepository],
	exports: [],
})
export class BedTypeModule {}
