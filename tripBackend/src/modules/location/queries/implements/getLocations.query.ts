import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';

import { LocationFilterRequestDto } from '../../dtos';

export class GetLocationsQuery implements IQuery {
	constructor(
		public readonly pagination: PaginationDto,
		public readonly filter: LocationFilterRequestDto,
	) {}
}
