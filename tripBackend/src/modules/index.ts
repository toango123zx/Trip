import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { DiscountModule } from './discount/discount.module';
import { HealthCheckModule } from './healthCheck/healthCheck.module';
import { LocationModule } from './location/location.module';
import { ProductModule } from './product/product.module';
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
	DiscountModule,
];
