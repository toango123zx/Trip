import { ICommand } from '@nestjs/cqrs';

import { UpdateProductDto } from 'src/models';
import { SupplierInformationDto } from 'src/modules/supplier/dtos';

export class UpdateProductInformationByProductIdCommand implements ICommand {
	constructor(
		public readonly productId: string,
		public readonly productInformationRequest: UpdateProductDto,
		public readonly supplierInformation: SupplierInformationDto,
	) {}
}
