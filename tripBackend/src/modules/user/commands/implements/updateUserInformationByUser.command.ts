import { ICommand } from '@nestjs/cqrs';

import { UpdateUserInformationByUserIdRequestDto } from '../../dtos/requests/updateUserInformationByUserId.request';

export class UpdateUserInformationByUserIdCommand implements ICommand {
	constructor(
		public readonly userId: string,
		public readonly updateUserDataRequest: UpdateUserInformationByUserIdRequestDto,
	) {}
}
