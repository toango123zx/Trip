import { ApiProperty } from '@nestjs/swagger';

import { productRateStatusEnum } from '@prisma/client';

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
		enum: productRateStatusEnum,
		enumName: 'productRateStatusEnum',
	})
	status: productRateStatusEnum;
}
