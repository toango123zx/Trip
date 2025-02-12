import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';

import { UserFilterRequestDto } from '../../dtos/requests/userFilter.request';

export class GetUsersQuery implements IQuery {
	constructor(
		public readonly pagination: PaginationDto,
		public readonly filter?: UserFilterRequestDto,
	) {}
}
