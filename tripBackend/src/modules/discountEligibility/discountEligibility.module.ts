import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { DiscountEligibilityRepository } from './discountEligibility.repository';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [],
	providers: [DiscountEligibilityRepository],
	exports: [],
})
export class DiscountEligibilityModule {}
