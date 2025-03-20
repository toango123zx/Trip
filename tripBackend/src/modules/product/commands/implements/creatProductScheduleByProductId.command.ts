import { ICommand } from '@nestjs/cqrs';

import { SupplierInformationDto } from 'src/modules/supplier/dtos';

import { CreateProdcutScheduleByProductIdRequestDto } from '../../dtos';

export class CreateProductScheduleByProductIdCommand implements ICommand {
	constructor(
		public readonly productId: string,
		public readonly productScheduleInformationRequest: CreateProdcutScheduleByProductIdRequestDto,
		public readonly supplierInformation: SupplierInformationDto,
	) {}
}
