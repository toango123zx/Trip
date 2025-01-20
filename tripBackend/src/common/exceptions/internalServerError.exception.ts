import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalServerErrorException extends HttpException {
	constructor() {
		super('Error from the server', HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
