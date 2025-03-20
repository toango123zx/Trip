import { ApiProperty } from '@nestjs/swagger';

import { ProductRateStatusEnum } from '@prisma/client';

export class ProductRateDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	star: number;
	@ApiProperty({
		type: 'string',
	})
	comment: string;
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
		enum: ProductRateStatusEnum,
		enumName: 'ProductRateStatusEnum',
	})
	status: ProductRateStatusEnum;
}
