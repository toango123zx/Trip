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
		default: 'https://11',
		required: false,
	})
	@IsOptional()
	@IsString()
	image?: string;
	@ApiProperty({
		enum: genderUserEnum,
		enumName: 'genderUserEnum',
		required: false,
		nullable: true,
	})
	@IsOptional()
	gender?: genderUserEnum | null;
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
		nullable: true,
	})
	@IsOptional()
	@IsDateString()
	dateOfBirth?: Date | null;
	@ApiProperty({
		type: 'string',
		required: false,
		nullable: true,
	})
	@IsOptional()
	@IsString()
	phoneNumber?: string | null;
	@ApiProperty({
		type: 'string',
		required: false,
		nullable: true,
	})
	@IsOptional()
	@IsString()
	address?: string | null;
}
