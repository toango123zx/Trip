import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/guards';
import { DatabaseModule } from '../database/database.module';
import { SupplierRepository } from '../supplier/supplier.repository';
import { UserRepository } from '../user/user.repository';

import { MessageRepository } from './message.repositroy';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	providers: [UserRepository, SupplierRepository, AuthGuard, MessageRepository],
})
export class MessageModule {}
