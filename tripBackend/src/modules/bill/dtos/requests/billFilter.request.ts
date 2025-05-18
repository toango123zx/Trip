import { ApiProperty } from '@nestjs/swagger';

import { BillStatusEnum } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderByEnum, SearchDto } from 'src/common';

export class BillFilterRequestDto extends SearchDto {
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	id: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	userId: OrderByEnum;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	userIdSearch: string;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	paymentMethod: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	createdAt: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	updatedAt: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	deletedAt: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	reductionPrice: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	totalPrice: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: BillStatusEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(BillStatusEnum)
	statusSearch: BillStatusEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	status: OrderByEnum;
}
