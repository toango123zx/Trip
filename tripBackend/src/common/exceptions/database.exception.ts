import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { Response } from 'express';

import { ConflictException } from './conflict.exception';
import { InternalServerErrorException } from './internalServerError.exception';
import { NotFoundException } from './notFound.exception';

@Catch(Prisma.PrismaClientKnownRequestError)
export class DatabaseException implements ExceptionFilter {
	catch(
		exception: Prisma.PrismaClientKnownRequestError,
		host: ArgumentsHost,
	): Promise<void> {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		let httpException: HttpException;

		switch (exception.code) {
			case 'P2002':
				httpException = new ConflictException(`${exception.meta.modelName}`);
				break;
			case 'P2025':
				httpException = new NotFoundException(`${exception.meta.modelName}`);
				break;
			case 'P1017':
				httpException = new InternalServerErrorException(
					'database connection failed',
				);
				break;
			default:
				httpException = new InternalServerErrorException();
				break;
		}

		response.status(httpException.getStatus()).json(httpException.getResponse());
		return;
	}
}
