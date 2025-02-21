import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '../database/services';
import { RoleRepository } from '../role/role.repository';

import { UserCommandHandlers } from './commands/handlers';
import { UserQueryHandlers } from './queries/handlers';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [UserController],
	providers: [
		PrismaService,
		UserRepository,
		RoleRepository,
		...UserQueryHandlers,
		...UserCommandHandlers,
	],
	exports: [],
})
export class UserModule {}
