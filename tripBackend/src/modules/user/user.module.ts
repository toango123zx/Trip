import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '../database/services';

import { UserQueryHandlers } from './queries/handlers';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [UserController],
	providers: [PrismaService, UserRepository, ...UserQueryHandlers],
	exports: [],
})
export class UserModule {}
