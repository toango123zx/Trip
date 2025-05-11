import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { DiscountTypeController } from './discountType.controller';
import { DiscountTypeRepository } from './discountType.repository';
import { DiscountTypeQueryHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [DiscountTypeController],
	providers: [DiscountTypeRepository, ...DiscountTypeQueryHandlers],
	exports: [],
})
export class DiscountTypeModule {}
