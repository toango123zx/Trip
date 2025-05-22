import { ApiProperty } from '@nestjs/swagger';

import { ProductRateStatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsOptional, IsEnum, IsInt } from 'class-validator';
import { OrderByEnum } from 'src/common';

export class ProductRateFilterRequestDto {
	@ApiProperty({
		type: 'number',
		required: false,
	})
	@Transform(({ value }) => Number.parseInt(value, 10))
	@IsOptional()
	@IsInt()
	starSearch: number;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsEnum(OrderByEnum)
	star: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsEnum(OrderByEnum)
	createdAt: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsEnum(OrderByEnum)
	updatedAt: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsEnum(OrderByEnum)
	deleteAt: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: ProductRateStatusEnum,
		required: false,
	})
	@IsOptional()
	@IsEnum(ProductRateStatusEnum)
	statusSearch: ProductRateStatusEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsEnum(OrderByEnum)
	status: OrderByEnum;
}
