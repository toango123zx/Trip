import { ApiProperty } from '@nestjs/swagger';

import {
	DiscountApplicationScopeStatusEnum,
	DiscountTypeStatusEnum,
} from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderByEnum, SearchDto } from 'src/common';

export class DiscountApplicationScopeFilterRequestDto extends SearchDto {
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
		enum: DiscountApplicationScopeStatusEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(DiscountTypeStatusEnum)
	statusSearch: DiscountApplicationScopeStatusEnum;
}
