import { ICommand } from '@nestjs/cqrs';

export class UpdateAdminRoleForUserCommand implements ICommand {
	constructor(public readonly userId: string) {}
}
