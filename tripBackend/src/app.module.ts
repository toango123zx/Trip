import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { LoggerMiddleware } from './middlewares/logger.middleware';
import { PrismaService } from './modules/database/services';
import { Modules } from './modules';

@Module({
	imports: [...Modules],
	providers: [PrismaService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		// consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
