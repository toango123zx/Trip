import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
	constructor(public readonly location?: string) {
		if (!location) {
			location = '';
		}
		super(
			{
				success: false,
				message: `Resource not found ${location}`,
			},
			HttpStatus.NOT_FOUND,
		);
	}
}
