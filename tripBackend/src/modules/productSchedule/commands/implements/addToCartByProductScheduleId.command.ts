import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

export class AddToCartByProductScheduleIdCommand implements ICommand {
	constructor(
		public readonly productScheduleId: string,
		public readonly myInformation: UserInformationDto,
	) {}
}
