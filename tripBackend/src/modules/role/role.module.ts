import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '../database/services';

import { RoleRepository } from './role.repository';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [],
	providers: [PrismaService],
	exports: [RoleRepository],
})
export class RoleModule {}
