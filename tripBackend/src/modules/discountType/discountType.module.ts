import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { DiscountTypeRepository } from './discountType.repository';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [],
	providers: [DiscountTypeRepository],
	exports: [],
})
export class DiscountTypeModule {}
