import { AuthModule } from './auth/auth.module';
import { BillModule } from './bill/cart.module';
import { CartModule } from './cart/cart.module';
import { DatabaseModule } from './database/database.module';
import { DiscountModule } from './discount/discount.module';
import { DiscountApplicationScopeModule } from './discountApplicationScope/discountApplicationScope.module';
import { DiscountEligibilityModule } from './discountEligibility/discountEligibility.module';
import { DiscountTypeModule } from './discountType/discountType.module';
import { HealthCheckModule } from './healthCheck/healthCheck.module';
import { InfoDiscountModule } from './InfoDiscount/infoDiscount.module';
import { LocationModule } from './location/location.module';
import { ProductModule } from './product/product.module';
import { ProductScheduleModule } from './productSchedule/productSchedule.module';
import { SupplierModule } from './supplier/supplier.module';
import { UserModule } from './user/user.module';

export const Modules = [
	DatabaseModule,
	HealthCheckModule,
	AuthModule,
	UserModule,
	SupplierModule,
	LocationModule,
	ProductModule,
	ProductScheduleModule,
	DiscountTypeModule,
	DiscountEligibilityModule,
	DiscountApplicationScopeModule,
	DiscountModule,
	InfoDiscountModule,
	CartModule,
	BillModule,
];
