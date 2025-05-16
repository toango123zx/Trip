import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

export class DeleteDiscountByDiscountIdCommand implements ICommand {
	constructor(
		public readonly discountId: string,
		public readonly myInformation: UserInformationDto,
	) {}
}
