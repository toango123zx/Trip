import { ICommand } from '@nestjs/cqrs';

import { SupplierInformationDto } from 'src/modules/supplier/dtos/supplierInformation.dto';

import { CreateRoomTypeRequestDto } from '../../dtos';

export class CreateRoomTypeByProductIdCommand implements ICommand {
	constructor(
		public readonly productId: string,
		public readonly roomTypeInformationRequest: CreateRoomTypeRequestDto,
		public readonly supplierInformation: SupplierInformationDto,
	) {}
}
