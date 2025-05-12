import { ICommand } from '@nestjs/cqrs';

import { SupplierInformationDto } from 'src/modules/supplier/dtos';

export class DeleteProductScheduleByProductScheduleIdCommand implements ICommand {
	constructor(
		public readonly productScheduleId: string,
		public readonly supplierInformation: SupplierInformationDto,
	) {}
}
