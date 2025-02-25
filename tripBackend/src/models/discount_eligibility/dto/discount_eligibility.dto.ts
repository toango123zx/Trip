import { ApiProperty } from '@nestjs/swagger';

import { discountEligibilityStatusEnum } from '@prisma/client';

export class DiscountEligibilityDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	name: string;
	@ApiProperty({
		type: 'string',
	})
	description: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	createAt: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	updateAt: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		nullable: true,
	})
	deletedAt: Date | null;
	@ApiProperty({
		enum: discountEligibilityStatusEnum,
		enumName: 'discountEligibilityStatusEnum',
	})
	status: discountEligibilityStatusEnum;
}
