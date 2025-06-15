import { IQuery } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

import { GetStatisticRequestDto } from '../../dtos';

export class GetBookedByUserIdQuery implements IQuery {
	constructor(
		public readonly myInformation: UserInformationDto,
		public readonly statisticFilter: GetStatisticRequestDto,
	) {}
}
