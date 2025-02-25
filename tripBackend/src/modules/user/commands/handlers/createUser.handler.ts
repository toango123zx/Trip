import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { genSalt, hash } from 'bcrypt';
import { ConflictException, HttpResponseBodySuccessDto } from 'src/common';
import { CreateAccountDto } from 'src/models';

import { AuthRepository } from 'src/modules/auth/auth.repository';
import { RoleRepository } from 'src/modules/role/role.repository';

import { UserInformationDto } from '../../dtos';
import { UserRepository } from '../../user.repository';
import { CreateUserCommand } from '../implements';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly roleRepository: RoleRepository,
		private readonly userRepository: UserRepository,
	) {}

	async execute(
		command: CreateUserCommand,
	): Promise<HttpResponseBodySuccessDto<UserInformationDto> | HttpException> {
		const { registerDto } = command;
		const user = await this.userRepository.findUserByEmail(registerDto.email);
		const account = await this.authRepository.findAccountByUsername(
			registerDto.username,
		);
		if (user || account) {
			throw new ConflictException('username or email');
		}

		const role = await this.roleRepository.findRoleByName(registerDto.roleName);

		const salt = await genSalt(10);
		const hashedPassword = await hash(registerDto.password, salt);

		const accountData: CreateAccountDto = {
			username: registerDto.username,
			password: hashedPassword,
			salt: salt,
			user: {
				create: {
					name: registerDto.name,
					email: registerDto.email,
					role: {
						connect: {
							id: role.id,
						},
					},
				},
			},
		};

		const newAccount = await this.authRepository.createAccount(accountData);
		const userInfomation =
			UserInformationDto.constructorFromAccount(newAccount).getUserInformation();

		return { success: true, data: userInfomation };
	}
}
