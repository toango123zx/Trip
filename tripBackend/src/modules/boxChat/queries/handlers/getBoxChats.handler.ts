import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, PaginationUtils } from 'src/common';

import { BoxChatRepository } from '../../boxChat.repository';
import { GetBoxChatResponseDto } from '../../dtos';
import { GetBoxChatsQuery } from '../implements';

@QueryHandler(GetBoxChatsQuery)
export class GetBoxChatsHandler implements IQueryHandler<GetBoxChatsQuery> {
	constructor(private readonly boxChatRepository: BoxChatRepository) {}

	async execute(
		query: GetBoxChatsQuery,
	): Promise<HttpResponseBodySuccessDto<GetBoxChatResponseDto[]>> {
		const { pagination, filter, myInformation } = query;
		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);
		const { nameSearch, ...boxChatFilter } = filter;
		const [boxChats, totalRecords] =
			await this.boxChatRepository.findBoxChatsByBoxChatIdAndBoxChatMembers(
				undefined,
				[myInformation.id],
				undefined,
				page,
				boxChatFilter,
			);

		const boxChatsInformation = boxChats.map(
			(boxChat) => new GetBoxChatResponseDto(boxChat),
		);

		return {
			success: true,
			data: boxChatsInformation,
			pagination: page.convertPaginationResponseDtoFromTotalRecords(totalRecords),
		};
	}
}
