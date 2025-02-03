import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import {
	SWAGGER_API_DESCRIPTION,
	SWAGGER_API_PATH,
	SWAGGER_API_TITLE,
	SWAGGER_API_VERSION,
} from 'src/common';

export function setupSwagger(app: INestApplication): void {
	const documentBuilder = new DocumentBuilder()
		.setTitle(SWAGGER_API_TITLE)
		.setDescription(SWAGGER_API_DESCRIPTION)
		.setVersion(SWAGGER_API_VERSION)
		.addBearerAuth();

	if (process.env.API_VERSION) {
		documentBuilder.setVersion(process.env.API_VERSION);
	}

	const document = SwaggerModule.createDocument(app, documentBuilder.build());
	SwaggerModule.setup(SWAGGER_API_PATH, app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});
}
