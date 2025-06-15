import { IQuery } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

import { GetStatisticRequestDto } from '../../dtos';

export class GetRevenueByUserIdQuery implements IQuery {
	constructor(
		public readonly myInformation: UserInformationDto,
		public readonly statisticFilter: GetStatisticRequestDto,
	) {}
}
