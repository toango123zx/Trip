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
	Matches,
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
	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/, {
		message:
			'Password must contain at least 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character',
	})
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
