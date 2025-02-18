import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '../database/services';
import { RoleRepository } from '../role/role.repository';
import { UserRepository } from '../user/user.repository';

import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthCommandHandlers } from './commands/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule, JwtModule],
	controllers: [AuthController],
	providers: [
		PrismaService,
		AuthRepository,
		UserRepository,
		RoleRepository,
		...AuthCommandHandlers,
	],
	exports: [],
})
export class AuthModule {}
