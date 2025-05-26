import { HttpException, HttpStatus } from '@nestjs/common';

export class unprocessableEntityException extends HttpException {
	constructor(public readonly location?: string) {
		super(
			{
				success: false,
				message: `Error due to input data missing ${location}`,
			},
			HttpStatus.UNPROCESSABLE_ENTITY,
		);
	}
}
