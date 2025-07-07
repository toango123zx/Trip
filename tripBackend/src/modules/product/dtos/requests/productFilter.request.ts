import { ApiProperty } from '@nestjs/swagger';

import { CountryEnum, ProductStatusEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { OrderByEnum, SearchDto } from 'src/common';

export class ProductFilterRequestDto extends SearchDto {
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	startTimeSearch?: Date;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	endTimeSearch?: Date;
	@ApiProperty({ type: 'number', required: false })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@IsPositive()
	priceFromSearch?: number;
	@ApiProperty({ type: 'number', required: false })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@IsPositive()
	priceToSearch?: number;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	name?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	time?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	quantityAvailable?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	age?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	quantityCompleted?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	quantityRate?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	avgRate?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	locationName?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	locationNameSearch?: string;
	@ApiProperty({
		type: 'string',
		enum: CountryEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	citySearch?: CountryEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	city?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	productCategoryName?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	createAt?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	updateAt?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	deletedAt?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: ProductStatusEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(ProductStatusEnum)
	statusSearch?: ProductStatusEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	status?: OrderByEnum;
}
