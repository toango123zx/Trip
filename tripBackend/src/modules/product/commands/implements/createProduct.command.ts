import { ICommand } from '@nestjs/cqrs';

import { SupplierInformationDto } from 'src/modules/supplier/dtos';

import { CreateProductRequestDto } from '../../dtos';

export class CreateProductCommand implements ICommand {
	constructor(
		public readonly createProductRequestDto: CreateProductRequestDto,
		public readonly supplierInformation: SupplierInformationDto,
	) {}
}
