import { Body, Controller, Get, HttpException, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { HttpResponseBodyDto, PaginationDto } from 'src/common';

import { Auth } from '../auth/decorators';
import { MyInformation } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import { CreateBoxChatCommand } from './commands/implements';
import {
	BoxChatFilterRequestDto,
	CreateBoxChatRequestDto,
	GetBoxChatResponseDto,
} from './dtos';
import { GetBoxChatsQuery } from './queries/implements';

@Controller('box-chat')
export class BoxChatController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get()
	@Auth()
	async getBoxChats(
		@MyInformation() myInformation: UserInformationDto,
		@Query() pagination: PaginationDto,
		@Query() filter: BoxChatFilterRequestDto,
	): Promise<HttpResponseBodyDto<GetBoxChatResponseDto[]>> {
		return this.queryBus.execute(
			new GetBoxChatsQuery(myInformation, pagination, filter),
		);
	}

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
