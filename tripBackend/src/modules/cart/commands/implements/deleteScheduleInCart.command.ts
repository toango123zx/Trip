import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

export class DeleteScheduleInCartCommand implements ICommand {
	constructor(
		public readonly cartId: string,
		public readonly myInformation: UserInformationDto,
	) {}
}
