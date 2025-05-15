import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { SupplierRepository } from '../supplier/supplier.repository';
import { UserRepository } from '../user/user.repository';

import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { CartCommandHandlers } from './commands/handlers';
import { CartQueryHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [CartController],
	providers: [
		CartRepository,
		UserRepository,
		SupplierRepository,
		...CartQueryHandlers,
		...CartCommandHandlers,
	],
	exports: [],
})
export class CartModule {}
