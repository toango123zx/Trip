import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { DiscountApplicationScopeController } from './discountApplicationScope.controller';
import { DiscountApplicationScopeRepository } from './discountApplicationScope.repository';
import { DiscountApplicationScopeQueryHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [DiscountApplicationScopeController],
	providers: [
		DiscountApplicationScopeRepository,
		...DiscountApplicationScopeQueryHandlers,
	],
	exports: [],
})
export class DiscountApplicationScopeModule {}
