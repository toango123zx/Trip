import { HttpException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';

import { BoxChatRepository } from '../../boxChat.repository';
import { GetBoxChatDetailResponseDto } from '../../dtos';
import { GetBoxChatByBoxChatIdQuery } from '../implements';

@QueryHandler(GetBoxChatByBoxChatIdQuery)
export class GetBoxChatByBoxChatIdHandler
	implements IQueryHandler<GetBoxChatByBoxChatIdQuery>
{
	constructor(private readonly boxChatRepository: BoxChatRepository) {}

	async execute(
		query: GetBoxChatByBoxChatIdQuery,
	): Promise<HttpResponseBodySuccessDto<GetBoxChatDetailResponseDto> | HttpException> {
		const { boxChatId, myInformation } = query;
		const boxChat = await this.boxChatRepository.findBoxChatByBoxChatId(
			boxChatId,
			myInformation.id,
		);

		if (!boxChat) {
			throw new NotFoundException('boxChatId');
		}

		return {
			success: true,
			data: new GetBoxChatDetailResponseDto(boxChat),
		};
	}
}
