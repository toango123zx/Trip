import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';
import { TransactionSessionRepository } from '../transactionSession/transactionSession.repository';

import { TransactionQueryHandlers } from './queries/handlers';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from './transaction.repository';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [TransactionController],
	providers: [
		TransactionSessionRepository,
		TransactionRepository,
		...TransactionQueryHandlers,
	],
	exports: [],
})
export class TransactionModule {}
