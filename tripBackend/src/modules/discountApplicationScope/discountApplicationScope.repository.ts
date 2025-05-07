import { Injectable } from '@nestjs/common';

import { DiscountApplicationScopeEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class DiscountApplicationScopeRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findDiscountApplicationScopeByDiscountApplicationScopeId(
		discountApplicationScopeId: string,
	): Promise<DiscountApplicationScopeEntity> {
		return this.prismaService.discountApplicationScope.findFirst({
			where: {
				id: discountApplicationScopeId,
			},
		});
	}
}
