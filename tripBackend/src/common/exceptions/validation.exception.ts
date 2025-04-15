import { HttpException, HttpStatus } from '@nestjs/common';

import { ValidationError } from 'class-validator';

export class ValidationException extends HttpException {
	constructor(message: string = 'request validation data failed') {
		super(
			{
				success: false,
				message: message,
			},
			HttpStatus.UNPROCESSABLE_ENTITY,
		);
	}

	static fromValidationError(errors: ValidationError[]): ValidationException {
		const message = Object.values(errors[0].constraints)[0];
		return new ValidationException(message);
	}
}
