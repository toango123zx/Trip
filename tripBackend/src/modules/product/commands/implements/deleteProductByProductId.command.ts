import { ICommand } from '@nestjs/cqrs';

import { SupplierInformationDto } from 'src/modules/supplier/dtos';

export class DeleteProductByProductIdCommand implements ICommand {
	constructor(
		public readonly productId: string,
		public readonly supplierInformation: SupplierInformationDto,
	) {}
}
