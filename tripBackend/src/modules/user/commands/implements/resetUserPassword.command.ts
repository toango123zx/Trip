import { ICommand } from '@nestjs/cqrs';

export class ResetUserPasswordCommand implements ICommand {
	constructor(public readonly userId: string) {}
}
