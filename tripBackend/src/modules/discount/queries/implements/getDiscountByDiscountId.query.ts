import { IQuery } from '@nestjs/cqrs';

import { DiscountStatusEnum } from '@prisma/client';

export class GetDiscountByDiscountIdQuery implements IQuery {
	constructor(
		public readonly discountId: string,
		public readonly status?: DiscountStatusEnum,
	) {}
}
