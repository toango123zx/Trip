import { Injectable } from '@nestjs/common';

import { DiscountTypeEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class DiscountTypeRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findDiscountTypeByDiscountTypeId(
		discountTypeId: string,
	): Promise<DiscountTypeEntity> {
		return this.prismaService.discountType.findUnique({
			where: {
				id: discountTypeId,
			},
		});
	}
}
