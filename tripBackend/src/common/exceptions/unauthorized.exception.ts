import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
	constructor(public readonly location?: string) {
		super(
			{
				status: 'fail',
				message: "You're not authenticated",
			},
			HttpStatus.UNAUTHORIZED,
		);
	}
}
