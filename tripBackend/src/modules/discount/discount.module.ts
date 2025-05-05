import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { DiscountController } from './discount.controller';
import { DiscountRepository } from './discount.repository';
import { DiscountQueryHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [DiscountController],
	providers: [DiscountRepository, ...DiscountQueryHandlers],
	exports: [],
})
export class DiscountModule {}
