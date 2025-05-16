import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';
import { UserInformationDto } from 'src/modules/user/dtos';

import { DiscountFilterRequestDto } from '../../dtos';

export class GetDiscountsByUserIdQuery implements IQuery {
	constructor(
		public readonly pagination: PaginationDto,
		public readonly myInformation: UserInformationDto,
		public readonly filter: DiscountFilterRequestDto,
	) {}
}
