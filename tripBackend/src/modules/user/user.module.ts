import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '../database/services';

import { UserRepository } from './user.repository';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [],
	providers: [PrismaService, UserRepository],
	exports: [UserRepository],
})
export class UserModule {}
