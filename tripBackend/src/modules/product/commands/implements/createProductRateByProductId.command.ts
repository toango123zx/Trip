import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

import { CreateProductRateByProductIdRequestDto } from '../../dtos';

export class CreateProductRateByProductIdCommand implements ICommand {
	constructor(
		public readonly productId: string,
		public readonly productRateInformation: CreateProductRateByProductIdRequestDto,
		public readonly myInformation: UserInformationDto,
	) {}
}
