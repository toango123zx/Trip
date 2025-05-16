import { ApiProperty } from '@nestjs/swagger';

import { DiscountEligibilityStatusEnum } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderByEnum, SearchDto } from 'src/common';

export class DiscountEligibilityFilterRequestDto extends SearchDto {
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
		enum: DiscountEligibilityStatusEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(DiscountEligibilityStatusEnum)
	statusSearch: DiscountEligibilityStatusEnum;
}
