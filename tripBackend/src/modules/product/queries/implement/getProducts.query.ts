import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';

import { ProductFilterRequestDto } from '../../dtos';

export class GetProductsQuery implements IQuery {
	constructor(
		public readonly pagination: PaginationDto,
		public readonly filter?: ProductFilterRequestDto,
	) {}
}
