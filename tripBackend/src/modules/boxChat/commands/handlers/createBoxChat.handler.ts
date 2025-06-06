import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserStatusEnum } from '@prisma/client';
import {
	ConflictException,
	HttpResponseBodySuccessDto,
	NotFoundException,
} from 'src/common';

import { UserRepository } from 'src/modules/user/user.repository';

import { BoxChatRepository } from '../../boxChat.repository';
import { GetBoxChatResponseDto } from '../../dtos';
import { CreateBoxChatCommand } from '../implements';

@CommandHandler(CreateBoxChatCommand)
export class CreateBoxChatHandler implements ICommandHandler<CreateBoxChatCommand> {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly boxChatRepository: BoxChatRepository,
	) {}

	async execute(
		command: CreateBoxChatCommand,
	): Promise<HttpResponseBodySuccessDto<GetBoxChatResponseDto> | HttpException> {
		const { boxChatInformation, myInformation } = command;

		const [, totalRecords] = await this.userRepository.findUsersByUserIds(
			[...boxChatInformation.boxChatMember],
			[UserStatusEnum.active],
		);
		if (totalRecords !== boxChatInformation.boxChatMember.length) {
			throw new NotFoundException('userId');
		}

		const [boxChats, totalBoxChats] =
			await this.boxChatRepository.findBoxChatsByBoxChatIdAndExactBoxChatMembers(
				undefined,
				[...boxChatInformation.boxChatMember, myInformation.id],
			);

		if (totalBoxChats > 0) {
			const boxChatExisted = boxChats.find(
				(boxChat) =>
					boxChat.boxChatMember.length ===
					boxChatInformation.boxChatMember.length + 1,
			);

			if (boxChatExisted) {
				throw new ConflictException();
			}
		}

		const createdBoxChat = await this.boxChatRepository.createBoxChat(
			{
				name: boxChatInformation.name,
			},
			[...boxChatInformation.boxChatMember, myInformation.id],
		);

		return {
			success: true,
			data: new GetBoxChatResponseDto(createdBoxChat),
		};
	}
}
