import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

import { CreateSupplierRequestDto } from '../../dtos';

export class CreateSupplierCommand implements ICommand {
	constructor(
		public readonly createSupplierRequestDto: CreateSupplierRequestDto,
		public readonly userInformation: UserInformationDto,
	) {}
}
