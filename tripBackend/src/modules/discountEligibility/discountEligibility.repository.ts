import { Injectable } from '@nestjs/common';

import { DiscountEligibilityEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class DiscountEligibilityRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findDiscountEligibilityByDiscountEligibilityId(
		discountEligibilityId: string,
	): Promise<DiscountEligibilityEntity> {
		return this.prismaService.discountEligibility.findUnique({
			where: {
				id: discountEligibilityId,
			},
		});
	}
}
