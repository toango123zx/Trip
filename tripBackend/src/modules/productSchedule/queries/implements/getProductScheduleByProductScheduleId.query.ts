import { IQuery } from '@nestjs/cqrs';

import { GetProductScheduleByProductScheduleIdRequestDto } from '../../dtos';

export class GetProductScheduleByProductScheduleIdQuery implements IQuery {
	constructor(
		public readonly productScheduleId: string,
		public readonly filter?: GetProductScheduleByProductScheduleIdRequestDto,
	) {}
}
