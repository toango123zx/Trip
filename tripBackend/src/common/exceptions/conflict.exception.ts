import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictException extends HttpException {
	constructor() {
		super('Resources already exist', HttpStatus.CONFLICT);
	}
}
