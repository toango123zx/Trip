import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { SupplierRepository } from '../supplier/supplier.repository';
import { UserRepository } from '../user/user.repository';

import { BillController } from './cart.controller';
import { BillRepository } from './cart.repository';
import { BillQueryHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [BillController],
	providers: [UserRepository, SupplierRepository, BillRepository, ...BillQueryHandlers],
	exports: [],
})
export class BillModule {}
