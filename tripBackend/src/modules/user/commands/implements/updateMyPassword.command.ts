import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from '../../dtos';

export class UpdateMyPasswordComand implements ICommand {
	constructor(
		public readonly currentPassword: string,
		public readonly newPassword: string,
		public readonly userInformation: UserInformationDto,
	) {}
}
