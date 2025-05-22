import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { ProductRateRepository } from './productRate.repository';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [],
	providers: [ProductRateRepository],
	exports: [],
})
export class ProductRateModule {}
