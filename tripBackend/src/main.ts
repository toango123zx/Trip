import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { commonAppConfig } from './configs';
import { setupSwagger } from './swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	const port = commonAppConfig.port;

	setupSwagger(app);

	await app.listen(port);

	console.log(`Application is running on port: ${port}`);
	console.log(`Swagger documentation is available at: http://localhost:${port}/api`);
}
bootstrap();
