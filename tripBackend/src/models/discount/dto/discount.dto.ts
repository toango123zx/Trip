import { ApiProperty } from '@nestjs/swagger';

import { DiscountProviderTypeEnum, DiscountStatusEnum } from '@prisma/client';

export class DiscountDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	name: string;
	@ApiProperty({
		enum: DiscountProviderTypeEnum,
		enumName: 'DiscountProviderTypeEnum',
	})
	discountProviderType: DiscountProviderTypeEnum;
	@ApiProperty({
		type: 'string',
	})
	code: string;
	@ApiProperty({
		type: 'string',
	})
	description: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	startTime: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	endTime: Date;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	value: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	quantity: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	point: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	applited: number;
	@ApiProperty({
		type: 'boolean',
	})
	stackable: boolean;
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
		enum: DiscountStatusEnum,
		enumName: 'DiscountStatusEnum',
	})
	status: DiscountStatusEnum;
}
