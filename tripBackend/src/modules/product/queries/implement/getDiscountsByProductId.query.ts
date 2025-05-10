import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';
import { DiscountFilterRequestDto } from 'src/modules/discount/dtos';

export class GetDiscountsByProductIdQuery implements IQuery {
	constructor(
		public readonly productId: string,
		public readonly pagination: PaginationDto,
		public readonly filter: DiscountFilterRequestDto,
	) {}
}
