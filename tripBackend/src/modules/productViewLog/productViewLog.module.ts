import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';

import { ProductViewLogRepository } from './productViewLog.repository';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [],
	providers: [ProductViewLogRepository],
	exports: [],
})
export class ProductViewLogModule {}
