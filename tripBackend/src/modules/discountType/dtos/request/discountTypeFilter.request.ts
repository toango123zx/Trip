import { ApiProperty } from '@nestjs/swagger';

import { DiscountTypeStatusEnum } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderByEnum, SearchDto } from 'src/common';

export class DiscountTypeFilterRequestDto extends SearchDto {
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	name: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	createAt: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	updateAt: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	startTime: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	status: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: DiscountTypeStatusEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(DiscountTypeStatusEnum)
	statusSearch: DiscountTypeStatusEnum;
}
