import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

import { InternalServerErrorException } from '../exceptions';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException | Error, host: ArgumentsHost): Promise<void> {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		let httpException: HttpException;

		if (exception instanceof HttpException) {
			httpException = exception;
		} else {
			httpException = new InternalServerErrorException();
		}

		response.status(httpException.getStatus()).json(httpException.getResponse());
		return;
	}
}
