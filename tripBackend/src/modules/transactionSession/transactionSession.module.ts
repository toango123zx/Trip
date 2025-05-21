import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { TransactionSessionRepository } from './transactionSession.repository';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [],
	providers: [TransactionSessionRepository],
	exports: [],
})
export class TransactionReferenceModule {}
