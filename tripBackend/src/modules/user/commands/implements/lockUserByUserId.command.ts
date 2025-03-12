import { ICommand } from '@nestjs/cqrs';

export class LockUserByUserIdCommand implements ICommand {
	constructor(public userId: string) {}
}
