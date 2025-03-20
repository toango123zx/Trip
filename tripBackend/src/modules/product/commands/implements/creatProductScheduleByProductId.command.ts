import { ICommand } from '@nestjs/cqrs';

import { SupplierInformationDto } from 'src/modules/supplier/dtos';

import { CreateProductScheduleByProductIdRequestDto } from '../../dtos';

export class CreateProductScheduleByProductIdCommand implements ICommand {
	constructor(
		public readonly productId: string,
		public readonly productScheduleInformationRequest: CreateProductScheduleByProductIdRequestDto,
		public readonly supplierInformation: SupplierInformationDto,
	) {}
}
