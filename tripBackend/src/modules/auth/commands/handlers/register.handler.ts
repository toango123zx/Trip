import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { genSalt, hash } from 'bcrypt';
import { ConflictException, HttpResponseBodySuccessDto } from 'src/common';
import { AccountEntity, CreateAccountDto } from 'src/models';

import { RoleRepository } from 'src/modules/role/role.repository';
import { UserRepository } from 'src/modules/user/user.repository';

import { AuthRepository } from '../../auth.repository';
import { RegisterCommand } from '../implements';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly userRepository: UserRepository,
		private readonly roleRepository: RoleRepository,
	) {}

	async execute(
		command: RegisterCommand,
	): Promise<HttpResponseBodySuccessDto<AccountEntity> | HttpException> {
		const { registerDto } = command;
		const user = await this.userRepository.getUserByEmail(registerDto.email);
		const account = await this.authRepository.findAccountByEmail(
			registerDto.username,
		);
		if (user || account) {
			throw new ConflictException('username or email');
		}

		const roleTourist = await this.roleRepository.getRoleByName('tourist');

		const salt = await genSalt(10);
		const hashedPassword = await hash(registerDto.password, salt);
		const accountData: CreateAccountDto = {
			username: registerDto.username,
			password: hashedPassword,
			salt: salt,
			user: {
				create: {
					name: registerDto.name,
					gender: registerDto.gender,
					email: registerDto.email,
					dateOfBirth: registerDto.dateOfBirth,
					phoneNumber: registerDto.phoneNumber,
					address: registerDto.address,
					roleId: roleTourist.id,
				},
			},
		};

		const newAccount = await this.authRepository.createAccount(accountData);
		return { success: true, data: newAccount };
	}
}
