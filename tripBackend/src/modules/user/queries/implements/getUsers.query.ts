import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';

export class GetUsersQuery implements IQuery {
	constructor(public readonly pagination: PaginationDto) {}
}
