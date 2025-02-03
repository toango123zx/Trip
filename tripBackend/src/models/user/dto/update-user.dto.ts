import { ApiProperty } from '@nestjs/swagger';

import { genderUserEnum } from '@prisma/client';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	name?: string;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	roleId?: string;
	@ApiProperty({
		type: 'string',
		default: 'https://11',
		required: false,
	})
	@IsOptional()
	@IsString()
	image?: string;
	@ApiProperty({
		enum: genderUserEnum,
		required: false,
	})
	@IsOptional()
	gender?: genderUserEnum;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	email?: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		required: false,
	})
	@IsOptional()
	@IsDateString()
	dateOfBirth?: Date;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	phoneNumber?: string;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	address?: string;
}
