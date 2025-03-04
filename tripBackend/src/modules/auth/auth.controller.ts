import { Body, Controller, HttpException, Post, UseFilters } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponseBodyDto } from 'src/common';
import { DatabaseException } from 'src/common/exceptions/database.exception';

import { LoginCommand, RegisterCommand } from './commands/implements';
import {
	LoginRequestDto,
	LoginResponseDto,
	RegisterRequestDto,
	RegisterResponseDto,
} from './dtos';

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
	): Promise<HttpResponseBodyDto<RegisterResponseDto | HttpException>> {
		return this.commandBus.execute(new RegisterCommand(registerDto));
	}

	@Post('login')
	async loginUser(
		@Body() loginDto: LoginRequestDto,
	): Promise<HttpResponseBodyDto<LoginResponseDto | HttpException>> {
		return this.commandBus.execute(new LoginCommand(loginDto));
	}
}
