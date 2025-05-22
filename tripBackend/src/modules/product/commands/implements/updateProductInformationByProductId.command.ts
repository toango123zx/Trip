import { ICommand } from '@nestjs/cqrs';

import { SupplierInformationDto } from 'src/modules/supplier/dtos';

import { UpdateProductInformationByProductIdRequestDto } from '../../dtos';

export class UpdateProductInformationByProductIdCommand implements ICommand {
	constructor(
		public readonly productId: string,
		public readonly productInformationRequest: UpdateProductInformationByProductIdRequestDto,
		public readonly supplierInformation: SupplierInformationDto,
	) {}
}
