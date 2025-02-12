import { Module } from '@nestjs/common';

import { PrismaService } from './services';
import { SeedService } from './services/seed.service';

@Module({
	imports: [],
	providers: [PrismaService, SeedService],
	exports: [PrismaService],
})
export class DatabaseModule {}
