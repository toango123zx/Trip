import { IQuery } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

export class GetBoxChatByBoxChatIdQuery implements IQuery {
	constructor(
		public readonly boxChatId: string,
		public readonly myInformation: UserInformationDto,
	) {}
}
