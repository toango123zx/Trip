import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { InfoDiscountRepository } from './infoDiscount.repository';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [],
	providers: [InfoDiscountRepository],
	exports: [],
})
export class InfoDiscountModule {}
