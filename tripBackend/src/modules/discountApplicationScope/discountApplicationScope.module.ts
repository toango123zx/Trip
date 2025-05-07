import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { DiscountApplicationScopeRepository } from './discountApplicationScope.repository';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [],
	providers: [DiscountApplicationScopeRepository],
	exports: [],
})
export class DiscountApplicationScopeModule {}
