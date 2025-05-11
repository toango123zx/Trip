import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';

import { DiscountEligibilityFilterRequestDto } from '../../dtos';

export class GetDiscountEligibilitiesQuery implements IQuery {
	constructor(
		public readonly pagination: PaginationDto,
		public readonly filter?: DiscountEligibilityFilterRequestDto,
	) {}
}
