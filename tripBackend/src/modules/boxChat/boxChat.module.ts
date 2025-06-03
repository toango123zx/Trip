import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { SupplierRepository } from '../supplier/supplier.repository';
import { UserRepository } from '../user/user.repository';

import { BoxChatController } from './boxChat.controller';
import { BoxChatRepository } from './boxChat.repository';
import { BoxChatCommandHandlers } from './commands/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [BoxChatController],
	providers: [
		UserRepository,
		SupplierRepository,
		BoxChatRepository,
		...BoxChatCommandHandlers,
	],
	exports: [],
})
export class BoxChatModule {}
