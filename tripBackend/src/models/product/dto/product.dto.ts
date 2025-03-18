import { ApiProperty } from '@nestjs/swagger';

import { ProductStatusEnum } from '@prisma/client';

export class ProductDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	name: string;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	time: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	quantityAvailable: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	age: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	quantityCompleted: number;
	@ApiProperty({
		type: 'string',
	})
	description: string;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	quantityRate: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	avgRate: number;
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
		enum: ProductStatusEnum,
		enumName: 'ProductStatusEnum',
	})
	status: ProductStatusEnum;
}
