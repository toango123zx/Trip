import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AccountExternalStatusEnum, UserStatusEnum } from '@prisma/client';
import {
	ConflictException,
	HttpResponseBodySuccessDto,
	NotFoundException,
} from 'src/common';

import { AuthRepository } from 'src/modules/auth/auth.repository';

import { UserInformationDto } from '../../dtos';
import { UserRepository } from '../../user.repository';
import { LockUserByUserIdCommand } from '../implements';

@CommandHandler(LockUserByUserIdCommand)
export class LockUserByUserdHandler implements ICommandHandler<LockUserByUserIdCommand> {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly userRepository: UserRepository,
	) {}
	async execute(
		command: LockUserByUserIdCommand,
	): Promise<HttpResponseBodySuccessDto<UserInformationDto> | HttpException> {
		const { userId } = command;
		const user = await this.userRepository.findUserByUserId(
			userId,
			UserStatusEnum.active,
		);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const account = await this.authRepository.findAccountByUserId(
			userId,
			UserStatusEnum.active,
		);
		const accountExternal = await this.authRepository.findAccountExternalByUserId(
			userId,
			AccountExternalStatusEnum.active,
		);
		if (!account && !accountExternal) {
			throw new ConflictException('account user');
		}

		const data = await this.userRepository.lockUserByUserId(
			user.id,
			!!account,
			!!accountExternal,
		);

		return {
			success: true,
			data: new UserInformationDto(data[0]).getUserInformation(),
		};
	}
}
