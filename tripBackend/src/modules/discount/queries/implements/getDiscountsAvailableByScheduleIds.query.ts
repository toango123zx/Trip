import { IQuery } from '@nestjs/cqrs';

import { DiscountFilterRequestDto } from '../../dtos';

export class GetDiscountsAvailableByScheduleIdsQuery implements IQuery {
	constructor(
		public readonly scheduleIds: string[],
		public readonly filter: DiscountFilterRequestDto,
	) {}
}
