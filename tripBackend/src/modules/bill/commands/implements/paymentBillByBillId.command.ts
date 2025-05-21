import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

export class PaymentBillByBillIdCommand implements ICommand {
	constructor(
		public readonly billId: string,
		public readonly myInformation: UserInformationDto,
	) {}
}
