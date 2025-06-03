import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { HttpResponseBodyDto } from 'src/common';

import { Auth } from '../auth/decorators';
import { MyInformation } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import { CreateBoxChatCommand } from './commands/implements';
import { CreateBoxChatRequestDto, GetBoxChatResponseDto } from './dtos';

@Controller('box-chat')
export class BoxChatController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post()
	@Auth()
	async createBoxChat(
		@Body() boxChatInformation: CreateBoxChatRequestDto,
		@MyInformation() myInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<GetBoxChatResponseDto | HttpException>> {
		return this.commandBus.execute(
			new CreateBoxChatCommand(boxChatInformation, myInformation),
		);
	}
}
