import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
	constructor() {
		super(
			{
				success: false,
				message:
					'The user does not have permission to make changes to this resource',
			},
			HttpStatus.FORBIDDEN,
		);
	}
}
