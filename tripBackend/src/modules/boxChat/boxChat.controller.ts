import { Body, Controller, Get, HttpException, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { HttpResponseBodyDto, PaginationDto } from 'src/common';

import { Auth } from '../auth/decorators';
import { MyInformation } from '../user/decorators';
import { UserInformationDto } from '../user/dtos';

import { CreateBoxChatCommand } from './commands/implements';
import {
	BoxChatFilterRequestDto,
	CreateBoxChatRequestDto,
	GetBoxChatDetailResponseDto,
	GetBoxChatResponseDto,
} from './dtos';
import { GetBoxChatByBoxChatIdQuery, GetBoxChatsQuery } from './queries/implements';

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

	@Get('/:boxChatId')
	@Auth()
	async getBoxChatByBoxChatId(
		@Param('boxChatId') boxChatId: string,
		@MyInformation() myInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<GetBoxChatDetailResponseDto | HttpException>> {
		return this.queryBus.execute(
			new GetBoxChatByBoxChatIdQuery(boxChatId, myInformation),
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
