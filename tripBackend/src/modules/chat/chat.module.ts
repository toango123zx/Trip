import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/guards';
import { DatabaseModule } from '../database/database.module';
import { MessageRepository } from '../message/message.repositroy';
import { SupplierRepository } from '../supplier/supplier.repository';
import { UserRepository } from '../user/user.repository';

import { BoxChatRepository } from './../boxChat/boxChat.repository';
import { ChatGateway } from './chat.gateway';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	providers: [
		ChatGateway,
		UserRepository,
		SupplierRepository,
		AuthGuard,
		BoxChatRepository,
		MessageRepository,
	],
})
export class ChatModule {}
