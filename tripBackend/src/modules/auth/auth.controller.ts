import { Body, Controller, HttpException, Post, UseFilters } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { DatabaseException } from 'src/common/exceptions/database.exception';

import { RegisterCommand } from './commands/implements';
import { RegisterRequestDto } from './dtos';
import { HttpResponseBodySuccessDto } from 'src/common';
import { AccountEntity } from 'src/models';

@UseFilters(DatabaseException)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Post('register')
	async registerAccount(
		@Body() registerDto: RegisterRequestDto,
	): Promise<HttpResponseBodySuccessDto<AccountEntity> | HttpException> {
		return this.commandBus.execute(new RegisterCommand(registerDto));
	}
}
