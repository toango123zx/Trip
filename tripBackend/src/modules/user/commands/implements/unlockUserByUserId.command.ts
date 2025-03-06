import { ICommand } from '@nestjs/cqrs';

export class UnlockUserByUserIdCommand implements ICommand {
	constructor(public readonly userId: string) {}
}
