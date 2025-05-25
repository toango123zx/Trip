import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';
import { UserFilterRequestDto, UserInformationDto } from 'src/modules/user/dtos';

export class GetUsersByProductScheduleIdQuery implements IQuery {
	constructor(
		public readonly productScheduleId: string,
		public readonly myInformation: UserInformationDto,
		public readonly pagination: PaginationDto,
		public readonly filter?: UserFilterRequestDto,
	) {}
}
