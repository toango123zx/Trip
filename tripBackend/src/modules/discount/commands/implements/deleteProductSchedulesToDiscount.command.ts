import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

export class DeleteProductSchedulesToDiscountCommand implements ICommand {
	constructor(
		public readonly discountId: string,
		public readonly productScheduleIds: string[],
		public readonly myInformation: UserInformationDto,
	) {}
}
