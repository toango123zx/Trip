import { HttpException, HttpStatus } from '@nestjs/common';

import { InternalServerErrorException } from './internalServerError.exception';

export class OptionalException extends HttpException {
	constructor(
		public readonly httpStatusCode: HttpStatus,
		public readonly message: string,
	) {
		if (!httpStatusCode) {
			throw new InternalServerErrorException();
		}
		super(
			{
				success: false,
				message: message,
			},
			httpStatusCode,
		);
	}
}
