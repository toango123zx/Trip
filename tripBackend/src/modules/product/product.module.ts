import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { BillRepository } from '../bill/bill.repository';
import { DatabaseModule } from '../database/database.module';
import { DiscountRepository } from '../discount/discount.repository';
import { LocationRepository } from '../location/location.repository';
import { ProductCategoryRepository } from '../productCategory/productCategory.repository';
import { ProductRateRepository } from '../productRate/productRate.repository';
import { ProductScheduleRepository } from '../productSchedule/productSchedule.repository';
import { ProviderMapRepository } from '../providerMap/providerMap.repository';
import { SupplierRepository } from '../supplier/supplier.repository';
import { UserRepository } from '../user/user.repository';

import { ProductCommandHandlers } from './commands/handlers';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductQueryHandlers } from './queries/handller';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [ProductController],
	providers: [
		UserRepository,
		SupplierRepository,
		ProductRepository,
		ProviderMapRepository,
		LocationRepository,
		ProductCategoryRepository,
		ProductRateRepository,
		ProductScheduleRepository,
		DiscountRepository,
		BillRepository,
		...ProductQueryHandlers,
		...ProductCommandHandlers,
	],
	exports: [],
})
export class ProductModule {}
