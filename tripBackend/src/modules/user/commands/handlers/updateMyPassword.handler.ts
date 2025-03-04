import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { genSalt, hash, compare } from 'bcrypt';
import {
	HttpResponseBodySuccessDto,
	optionalException,
	ValidationException,
} from 'src/common';
import { UpdateAccountDto } from 'src/models';

import { AuthRepository } from 'src/modules/auth/auth.repository';

import { UpdateMyPasswordComand } from '../implements';

@CommandHandler(UpdateMyPasswordComand)
export class UpdateMyPasswordHandler implements ICommandHandler<UpdateMyPasswordComand> {
	constructor(private readonly authRepository: AuthRepository) {}

	async execute(
		command: UpdateMyPasswordComand,
	): Promise<HttpResponseBodySuccessDto | HttpException> {
		const { currentPassword, newPassword, userInformation } = command;
		const account = await this.authRepository.findAccountByUserId(userInformation.id);
		const isPasswordValid = await compare(currentPassword, account.password);
		if (!isPasswordValid) {
			throw new optionalException(
				HttpStatus.FORBIDDEN,
				'Current password is incorrect',
			);
		}

		if (currentPassword === newPassword) {
			throw new ValidationException(
				'New password must be different from the current password',
			);
		}

		const salt = await genSalt(10);
		const newHashedPassword = await hash(newPassword, salt);

		const updateAccountData: UpdateAccountDto = {
			password: newHashedPassword,
			salt: salt,
		};

		await this.authRepository.updateAccountByAccountId(account.id, updateAccountData);
		return {
			success: true,
			data: undefined,
		};
	}
}
