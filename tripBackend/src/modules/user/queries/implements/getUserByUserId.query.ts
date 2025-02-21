import { IQuery } from '@nestjs/cqrs';

export class GetUserByUserIdQuery implements IQuery {
	constructor(public readonly userId: string) {
		this.userId = userId.trim();
	}
}
