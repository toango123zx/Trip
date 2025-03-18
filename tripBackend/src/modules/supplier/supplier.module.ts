import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { RoleRepository } from '../role/role.repository';
import { UserRepository } from '../user/user.repository';

import { SupplierCommandHandlers } from './commands/handlers/indext';
import { SupplierController } from './supplier.controller';
import { SupplierRepository } from './supplier.repository';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [SupplierController],
	providers: [
		SupplierRepository,
		RoleRepository,
		UserRepository,
		...SupplierCommandHandlers,
	],
	exports: [],
})
export class SupplierModule {}
