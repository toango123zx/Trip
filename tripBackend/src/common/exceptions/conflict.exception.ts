import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictException extends HttpException {
	constructor(public readonly location?: string) {
		super(`Resources already exist ${location}`, HttpStatus.CONFLICT);
	}
}
