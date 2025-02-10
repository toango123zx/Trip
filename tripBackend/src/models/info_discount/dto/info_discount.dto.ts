import { ApiProperty } from '@nestjs/swagger';

import { infoDiscountStatusEnum } from '@prisma/client';

export class InfoDiscountDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
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
		enum: infoDiscountStatusEnum,
	})
	status: infoDiscountStatusEnum;
}
