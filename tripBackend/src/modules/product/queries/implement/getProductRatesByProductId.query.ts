import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';
import { ProductRateFilterRequestDto } from 'src/modules/productRate/dto';

export class GetProductRatesByProductIdQuery implements IQuery {
	constructor(
		public readonly productId: string,
		public readonly pagination: PaginationDto,
		public readonly filter?: ProductRateFilterRequestDto,
	) {}
}
