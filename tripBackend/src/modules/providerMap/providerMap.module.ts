import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { ProviderMapRepository } from './providerMap.repository';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [],
	providers: [ProviderMapRepository],
	exports: [],
})
export class ProviderMapModule {}
