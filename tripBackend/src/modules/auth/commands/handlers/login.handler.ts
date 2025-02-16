import { HttpException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { hash } from 'bcrypt';
import {
	ForbiddenException,
	HttpResponseBodySuccessDto,
	UnauthorizedException,
} from 'src/common';
import { jwtConfig } from 'src/configs';

import { AuthRepository } from '../../auth.repository';
import { LoginResponseDto } from '../../dtos';
import { LoginCommand } from '../implements';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

	async execute(
		command: LoginCommand,
	): Promise<HttpResponseBodySuccessDto<LoginResponseDto> | HttpException> {
		const { loginDto } = command;
		const account = await this.authRepository.findAccountByUsername(
			loginDto.username,
		);
		if (!account) {
			throw new NotFoundException('user');
		}

		const hashedPassword = await hash(loginDto.password, account.salt);

		if (hashedPassword !== account.password) {
			throw new UnauthorizedException();
		}

		if (!account.user.role) {
			throw new ForbiddenException();
		}

		const payloadToken = {
			accountId: account.id,
			userId: account.userId,
			roleName: account.user.role.name,
		};

		const accesToken = this.jwtService.sign(payloadToken, {
			expiresIn: jwtConfig.expiresIn,
			secret: jwtConfig.secret,
		});

		return { success: true, data: { accessToken: accesToken } };
	}
}
