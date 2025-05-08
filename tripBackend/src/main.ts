import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { commonAppConfig } from './configs';
import { setupSwagger } from './swagger';
import { ValidationPipe } from '@nestjs/common';
import { ValidationException } from './common';
import { DatabaseException } from './common/exceptions/database.exception';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: commonAppConfig.corsOrigin,
		credentials: true,
	});

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			exceptionFactory: (errors) => ValidationException.fromValidationError(errors),
		}),
	);
	app.useGlobalFilters(new HttpExceptionFilter(), new DatabaseException());

	const port = commonAppConfig.port;
	setupSwagger(app);
	app.use(morgan('combined'));
	app.use(cookieParser(commonAppConfig.cookieSecret));

	await app.listen(port);

	console.log(`Application is running on port: ${port}`);
	console.log(`Swagger documentation is available at: http://localhost:${port}/api`);
}
bootstrap();