import { ApiProperty } from '@nestjs/swagger';

import { genderUserEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
	IsDate,
	IsEmail,
	IsNotEmpty,
	IsPhoneNumber,
	IsString,
	Length,
} from 'class-validator';

export class RegisterRequestDto {
	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	username: string;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	password: string;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({
		enum: genderUserEnum,
	})
	@IsNotEmpty()
	@IsString()
	gender: genderUserEnum;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@Type(() => Date)
	@IsDate()
	dateOfBirth: Date;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@Length(10, 10)
	@IsPhoneNumber('VN')
	phoneNumber: string;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	address: string;
}
