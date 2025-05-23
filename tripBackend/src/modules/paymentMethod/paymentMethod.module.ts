import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { PaymentMethodRepository } from './paymentMethod.repository';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [],
	providers: [PaymentMethodRepository],
	exports: [],
})
export class PaymentMethodModule {}
