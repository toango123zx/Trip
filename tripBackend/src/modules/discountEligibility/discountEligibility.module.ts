import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { DiscountEligibilityController } from './discountEligibility.controller';
import { DiscountEligibilityRepository } from './discountEligibility.repository';
import { DiscountEligibilitiesQueryHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [DiscountEligibilityController],
	providers: [DiscountEligibilityRepository, ...DiscountEligibilitiesQueryHandlers],
	exports: [],
})
export class DiscountEligibilityModule {}
