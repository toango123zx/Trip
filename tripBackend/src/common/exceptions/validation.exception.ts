import { HttpException, HttpStatus } from '@nestjs/common';

import { ValidationError } from 'class-validator';

export class ValidationException extends HttpException {
	constructor(errors: ValidationError[]) {
		// const formattedErrors = errors.map((err) => ({
		// 	field: err.property,
		// 	message: Object.values(err.constraints)[0],
		// }));
		const message = Object.values(errors[0].constraints)[0];

		super(
			{
				status: 'fail',
				message: message,
			},
			HttpStatus.UNPROCESSABLE_ENTITY,
		);
	}
}
