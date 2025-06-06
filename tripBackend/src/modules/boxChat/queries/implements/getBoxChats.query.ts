import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';
import { UserInformationDto } from 'src/modules/user/dtos';

import { BoxChatFilterRequestDto } from '../../dtos';

export class GetBoxChatsQuery implements IQuery {
	constructor(
		public readonly myInformation: UserInformationDto,
		public readonly pagination: PaginationDto,
		public readonly filter: BoxChatFilterRequestDto,
	) {}
}
