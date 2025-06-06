import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

import { CreateBoxChatRequestDto } from '../../dtos';

export class CreateBoxChatCommand implements ICommand {
	constructor(
		public readonly boxChatInformation: CreateBoxChatRequestDto,
		public readonly myInformation: UserInformationDto,
	) {}
}
