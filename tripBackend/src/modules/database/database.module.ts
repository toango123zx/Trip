import { Module } from '@nestjs/common';
import { PrismaService } from './services';

@Module({
	imports: [],
	providers: [PrismaService],
	exports: [PrismaService],
})
export class DatabaseModule {}
