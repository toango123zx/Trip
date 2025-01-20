import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
	constructor(public readonly location?: string) {
		super(`Resource not found ${location}`, HttpStatus.NOT_FOUND);
	}
}
