import { ICommand } from '@nestjs/cqrs';

import { LoginRequestDto } from '../../dtos';

export class LoginCommand implements ICommand {
	constructor(public readonly loginDto: LoginRequestDto) {}
}
