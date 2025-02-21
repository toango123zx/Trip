import { ICommand } from '@nestjs/cqrs';

import { CreateUserRequestDto } from '../../dtos';

export class CreateUserCommand implements ICommand {
	constructor(public readonly registerDto: CreateUserRequestDto) {}
}
