import { discountProviderTypeEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateDiscountDto {
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	name?: string;
	@ApiProperty({
		enum: discountProviderTypeEnum,
		required: false,
	})
	@IsOptional()
	discountProviderType?: discountProviderTypeEnum;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	code?: string;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	description?: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		required: false,
	})
	@IsOptional()
	@IsDateString()
	startTime?: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		required: false,
	})
	@IsOptional()
	@IsDateString()
	endTime?: Date;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
		required: false,
	})
	@IsOptional()
	@IsInt()
	value?: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
		required: false,
	})
	@IsOptional()
	@IsInt()
	quantity?: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
		default: 0,
		required: false,
	})
	@IsOptional()
	@IsInt()
	point?: number;
	@ApiProperty({
		type: 'boolean',
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	stackable?: boolean;
}
