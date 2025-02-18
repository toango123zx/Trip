import { ICommand } from '@nestjs/cqrs';

import { RegisterRequestDto } from '../../dtos';

export class RegisterCommand implements ICommand {
	constructor(public readonly registerDto: RegisterRequestDto) {}
}
