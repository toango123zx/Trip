import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { DiscountApplicationScopeRepository } from '../discountApplicationScope/discountApplicationScope.repository';
import { DiscountEligibilityRepository } from '../discountEligibility/discountEligibility.repository';
import { DiscountTypeRepository } from '../discountType/discountType.repository';
import { InfoDiscountRepository } from '../InfoDiscount/infoDiscount.repository';
import { ProductRepository } from '../product/product.repository';
import { ProductScheduleRepository } from '../productSchedule/productSchedule.repository';
import { SupplierRepository } from '../supplier/supplier.repository';
import { UserRepository } from '../user/user.repository';

import { DiscountCommandHandlers } from './commands/handlers';
import { DiscountController } from './discount.controller';
import { DiscountRepository } from './discount.repository';
import { DiscountQueryHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [DiscountController],
	providers: [
		UserRepository,
		SupplierRepository,
		ProductRepository,
		ProductScheduleRepository,
		DiscountTypeRepository,
		DiscountEligibilityRepository,
		DiscountApplicationScopeRepository,
		DiscountRepository,
		InfoDiscountRepository,
		...DiscountQueryHandlers,
		...DiscountCommandHandlers,
	],
	exports: [],
})
export class DiscountModule {}
