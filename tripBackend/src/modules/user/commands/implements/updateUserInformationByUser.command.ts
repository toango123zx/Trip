import { ICommand } from '@nestjs/cqrs';

import { UpdateUserInformationByUserIdRequestDto } from '../../dtos';

export class UpdateUserInformationByUserIdCommand implements ICommand {
	constructor(
		public readonly userId: string,
		public readonly updateUserDataRequest: UpdateUserInformationByUserIdRequestDto,
	) {}
}
