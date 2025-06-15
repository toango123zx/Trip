import { Module, NestModule } from '@nestjs/common';

// import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';

import { Modules } from './modules';
import { PrismaService } from './modules/database/services';

@Module({
	imports: [
		...Modules,
		// ConfigModule.forRoot({
		// 	isGlobal: true,
		// }),
	],
	providers: [PrismaService],
})
export class AppModule implements NestModule {
	// configure(consumer: MiddlewareConsumer) {
	// 	consumer.apply(LoggerMiddleware).forRoutes('*');
	// }
	configure(): void {}
}
