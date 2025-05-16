import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';
import { UserInformationDto } from 'src/modules/user/dtos';

import { ProductFilterRequestDto } from '../../dtos';

export class GetProductsManagementQuery implements IQuery {
	constructor(
		public readonly pagination: PaginationDto,
		public readonly myInformation: UserInformationDto,
		public readonly filter?: ProductFilterRequestDto,
	) {}
}
