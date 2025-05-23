import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

import { CreateBillRequest } from '../../dtos';

export class CreateBillCommand implements ICommand {
	constructor(
		public readonly myInformation: UserInformationDto,
		public readonly billInformation: CreateBillRequest,
	) {}
}
