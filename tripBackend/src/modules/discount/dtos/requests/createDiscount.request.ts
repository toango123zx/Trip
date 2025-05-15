import { ApiProperty, OmitType } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AutoTrim } from 'src/common/decorators';
import { CreateDiscountDto } from 'src/models';
export class CreateDiscountRequestDto extends OmitType(CreateDiscountDto, [
	'discountProviderType',
	'discountType',
	'discountEligibility',
	'discountApplicationScope',
	'user',
]) {
	@AutoTrim()
	name: string;
	@AutoTrim()
	description: string;
	@ApiProperty({
		type: String,
		required: true,
		default: 'cm9m9tn960005e56c8tmr6go9',
	})
	@AutoTrim()
	@IsNotEmpty()
	@IsString()
	discountTypeId: string;
	@ApiProperty({
		type: String,
		required: true,
		default: 'cm9m9tn960005e56c8tmr6go9',
	})
	@AutoTrim()
	@IsNotEmpty()
	@IsString()
	discountEligibilityId: string;
	@ApiProperty({
		type: Boolean,
		required: false,
		default: 'false',
	})
	@IsOptional()
	@IsBoolean()
	stackable?: string;
	@AutoTrim()
	@IsNotEmpty()
	@IsString()
	discountApplicationScopeId: string;
	@IsOptional()
	point?: number;
	@ApiProperty({
		type: String,
		isArray: true,
		required: false,
	})
	@IsOptional()
	@IsArray()
	@Type(() => String)
	@IsString({ each: true })
	@AutoTrim()
	scheduleIds?: string[];
}
