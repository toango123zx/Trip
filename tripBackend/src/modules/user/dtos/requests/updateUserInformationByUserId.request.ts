import { ApiProperty, OmitType } from '@nestjs/swagger';

import { genderUserEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { RoleEnum } from 'src/common';
import { UpdateUserDto } from 'src/models';

export class UpdateUserInformationByUserIdRequestDto extends OmitType(UpdateUserDto, [
	'role',
] as const) {
	@ApiProperty({
		type: 'string',
		enum: RoleEnum,
		required: false,
		default: RoleEnum.Tourist,
	})
	@IsOptional()
	@IsString()
	@IsEnum(RoleEnum)
	roleName?: RoleEnum;
	@Transform(({ value }) => value.trim())
	name?: string;
	@Transform(({ value }) => value.trim())
	image?: string;
	@Transform(({ value }) => value.trim())
	gender?: genderUserEnum | null;
	@Transform(({ value }) => value.trim())
	@IsEmail()
	email?: string;
	@Transform(({ value }) => value.trim())
	dateOfBirth?: Date | null;
	@Transform(({ value }) => value.trim())
	@IsPhoneNumber('VN')
	phoneNumber?: string | null;
	@Transform(({ value }) => value.trim())
	address?: string | null;
}
