import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

import { CreateWithdrawalBillRequestDto } from '../../dtos';

export class CreateWithdrawalBillByUserIdCommand implements ICommand {
	constructor(
		public readonly myInformation: UserInformationDto,
		public readonly withDrawalBillInformation: CreateWithdrawalBillRequestDto,
	) {}
}
