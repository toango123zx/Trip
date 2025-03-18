import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
	AccountExternalStatusEnum,
	AccountStatusEnum,
	UserStatusEnum,
} from '@prisma/client';
import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';

import { AuthRepository } from 'src/modules/auth/auth.repository';

import { UserInformationDto } from '../../dtos';
import { UserRepository } from '../../user.repository';
import { UnlockUserByUserIdCommand } from '../implements';

@CommandHandler(UnlockUserByUserIdCommand)
export class UnlockUserByUserIdHandler
	implements ICommandHandler<UnlockUserByUserIdCommand>
{
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly userRepository: UserRepository,
	) {}

	async execute(
		command: UnlockUserByUserIdCommand,
	): Promise<HttpResponseBodySuccessDto<UserInformationDto> | HttpException> {
		const { userId } = command;
		const user = await this.userRepository.findUserByUserId(
			userId,
			UserStatusEnum.locked,
		);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		const account = await this.authRepository.findAccountByUserId(
			userId,
			AccountStatusEnum.locked,
		);
		const accountExternal = await this.authRepository.findAccountExternalByUserId(
			userId,
			AccountExternalStatusEnum.locked,
		);
		if (!account && !accountExternal) {
			throw new NotFoundException('Account not found');
		}
		const data = await this.userRepository.unlockUserByUserId(
			userId,
			!!account,
			!!accountExternal,
		);
		return {
			success: true,
			data: new UserInformationDto(data[0]).getUserInformation(),
		};
	}
}
