import { DiscountProviderTypeEnum } from '@prisma/client';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
	IsBoolean,
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectUserDto } from '../../user/dto/connect-user.dto';
import { ConnectDiscountTypeDto } from '../../discountType/dto/connect-discountType.dto';
import { ConnectDiscountEligibilityDto } from '../../discountEligibility/dto/connect-discountEligibility.dto';
import { ConnectDiscountApplicationScopeDto } from '../../discountApplicationScope/dto/connect-discountApplicationScope.dto';

export class CreateDiscountUserRelationInputDto {
	@ApiProperty({
		type: ConnectUserDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectUserDto)
	connect: ConnectUserDto;
}
export class CreateDiscountDiscountTypeRelationInputDto {
	@ApiProperty({
		type: ConnectDiscountTypeDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectDiscountTypeDto)
	connect: ConnectDiscountTypeDto;
}
export class CreateDiscountDiscountEligibilityRelationInputDto {
	@ApiProperty({
		type: ConnectDiscountEligibilityDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectDiscountEligibilityDto)
	connect: ConnectDiscountEligibilityDto;
}
export class CreateDiscountDiscountApplicationScopeRelationInputDto {
	@ApiProperty({
		type: ConnectDiscountApplicationScopeDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectDiscountApplicationScopeDto)
	connect: ConnectDiscountApplicationScopeDto;
}

@ApiExtraModels(
	ConnectUserDto,
	CreateDiscountUserRelationInputDto,
	ConnectDiscountTypeDto,
	CreateDiscountDiscountTypeRelationInputDto,
	ConnectDiscountEligibilityDto,
	CreateDiscountDiscountEligibilityRelationInputDto,
	ConnectDiscountApplicationScopeDto,
	CreateDiscountDiscountApplicationScopeRelationInputDto,
)
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
		default: false,
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	stackable?: boolean;
	@ApiProperty({
		type: CreateDiscountDiscountTypeRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateDiscountDiscountTypeRelationInputDto)
	discountType: CreateDiscountDiscountTypeRelationInputDto;
	@ApiProperty({
		type: CreateDiscountDiscountEligibilityRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateDiscountDiscountEligibilityRelationInputDto)
	discountEligibility: CreateDiscountDiscountEligibilityRelationInputDto;
	@ApiProperty({
		type: CreateDiscountDiscountApplicationScopeRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateDiscountDiscountApplicationScopeRelationInputDto)
	discountApplicationScope: CreateDiscountDiscountApplicationScopeRelationInputDto;
}
