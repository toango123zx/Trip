import { AuthModule } from './auth/auth.module';
import { BillModule } from './bill/bill.module';
import { BoxChatModule } from './boxChat/boxChat.module';
import { CartModule } from './cart/cart.module';
import { DatabaseModule } from './database/database.module';
import { DiscountModule } from './discount/discount.module';
import { DiscountApplicationScopeModule } from './discountApplicationScope/discountApplicationScope.module';
import { DiscountEligibilityModule } from './discountEligibility/discountEligibility.module';
import { DiscountTypeModule } from './discountType/discountType.module';
import { HealthCheckModule } from './healthCheck/healthCheck.module';
import { InfoDiscountModule } from './InfoDiscount/infoDiscount.module';
import { LocationModule } from './location/location.module';
import { PaymentMethodModule } from './paymentMethod/paymentMethod.module';
import { ProductModule } from './product/product.module';
import { ProductRateModule } from './productRate/productRate.module';
import { ProductScheduleModule } from './productSchedule/productSchedule.module';
import { ProductViewLogModule } from './productViewLog/productViewLog.module';
import { SupplierModule } from './supplier/supplier.module';
import { TransactionModule } from './transaction/transaction.module';
import { TransactionReferenceModule } from './transactionSession/transactionSession.module';
import { UserModule } from './user/user.module';

export const Modules = [
	DatabaseModule,
	HealthCheckModule,
	AuthModule,
	UserModule,
	SupplierModule,
	LocationModule,
	ProductModule,
	ProductRateModule,
	ProductScheduleModule,
	DiscountTypeModule,
	DiscountEligibilityModule,
	DiscountApplicationScopeModule,
	DiscountModule,
	InfoDiscountModule,
	CartModule,
	BillModule,
	PaymentMethodModule,
	TransactionReferenceModule,
	TransactionModule,
	BoxChatModule,
	ProductViewLogModule,
];
