import { IQuery } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

export class GetBillByBillIdQuery implements IQuery {
	constructor(
		public readonly billId: string,
		public readonly myInformation: UserInformationDto,
	) {}
}
