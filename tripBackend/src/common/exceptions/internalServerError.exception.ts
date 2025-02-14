import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalServerErrorException extends HttpException {
	constructor(public readonly location?: string) {
		if (!location) {
			location = '';
		}
		super(
			{
				status: 'fail',
				message: `Error from the server ${location}`,
			},
			HttpStatus.INTERNAL_SERVER_ERROR,
		);
	}
}
