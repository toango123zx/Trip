import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { genSalt, hash } from 'bcrypt';
import { generate } from 'generate-password';
import { AccountStatusEnum, HttpResponseBodyDto, NotFoundException } from 'src/common';
import { UpdateAccountDto } from 'src/models';

import { AuthRepository } from 'src/modules/auth/auth.repository';

import { ResetUserPasswordResponseDto } from '../../dtos';
import { UserRepository } from '../../user.repository';
import { ResetUserPasswordCommand } from '../implements';

@CommandHandler(ResetUserPasswordCommand)
export class ResetUserPasswordHandler
	implements ICommandHandler<ResetUserPasswordCommand>
{
	constructor(
		private readonly userRepository: UserRepository,
		private readonly authRepository: AuthRepository,
	) {}

	async execute(
		command: ResetUserPasswordCommand,
	): Promise<HttpResponseBodyDto<ResetUserPasswordResponseDto> | HttpException> {
		const account = await this.authRepository.findAccountByUserId(
			command.userId,
			AccountStatusEnum.active,
		);
		if (!account) {
			throw new NotFoundException('userId');
		}

		const newPassword = generate({
			length: 8,
			numbers: true,
			symbols: true,
			uppercase: true,
			lowercase: true,
			strict: true,
		});
		const salt = await genSalt(10);
		const hashedPassword = await hash(newPassword, salt);
		const updateAccountData: UpdateAccountDto = {
			password: hashedPassword,
			salt: salt,
		};

		await this.authRepository.updateAccountByAccountId(account.id, updateAccountData);

		return {
			success: true,
			data: {
				userId: account.userId,
				password: newPassword,
			},
		};
	}
}
