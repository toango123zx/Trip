import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { DiscountProviderTypeEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

import { ConnectUserDto } from '../../user/dto/connect-user.dto';

export class CreateDiscountUserRelationInputDto {
	@ApiProperty({
		type: ConnectUserDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectUserDto)
	connect: ConnectUserDto;
}

@ApiExtraModels(ConnectUserDto, CreateDiscountUserRelationInputDto)
export class CreateDiscountDto {
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	name: string;
	@ApiProperty({
		enum: DiscountProviderTypeEnum,
		enumName: 'DiscountProviderTypeEnum',
	})
	@IsNotEmpty()
	discountProviderType: DiscountProviderTypeEnum;
	@ApiProperty({
		type: CreateDiscountUserRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateDiscountUserRelationInputDto)
	user: CreateDiscountUserRelationInputDto;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	code: string;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	description: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	@IsNotEmpty()
	@IsDateString()
	startTime: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	@IsNotEmpty()
	@IsDateString()
	endTime: Date;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	value: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	quantity: number;
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
	})
	@IsNotEmpty()
	@IsBoolean()
	stackable: boolean;
}
