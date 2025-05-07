import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

import { CreateDiscountRequestDto } from '../../dtos';

export class CreateDiscountCommand implements ICommand {
	constructor(
		public readonly discountInformation: CreateDiscountRequestDto,
		public readonly myInformation: UserInformationDto,
	) {}
}
