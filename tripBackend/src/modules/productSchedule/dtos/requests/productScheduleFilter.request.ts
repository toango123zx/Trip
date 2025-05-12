import { ApiProperty } from '@nestjs/swagger';

import { ProductScheduleStatusEnum } from '@prisma/client';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderByEnum } from 'src/common';

export class ProductScheduleFilterRequestDto {
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		required: false,
	})
	@IsOptional()
	@IsDate()
	startTimeSearch: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		required: false,
	})
	@IsOptional()
	@IsDate()
	endTimeSearch: Date;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	startTime?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	endTime?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	price?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	booked?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	productScheduleId?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	startOrder?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	endOrder?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	createAt?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	updateAt?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(OrderByEnum)
	deletedAt?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: ProductScheduleStatusEnum,
		required: false,
	})
	@IsOptional()
	@IsEnum(ProductScheduleStatusEnum)
	status?: ProductScheduleStatusEnum;
}
