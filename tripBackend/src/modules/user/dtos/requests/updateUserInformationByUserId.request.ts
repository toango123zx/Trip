import { ApiProperty, OmitType } from '@nestjs/swagger';

import { genderUserEnum } from '@prisma/client';
import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsPhoneNumber,
	IsString,
	IsUrl,
} from 'class-validator';
import { RoleEnum } from 'src/common';
import { AutoTrim } from 'src/common/decorators';
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
	@AutoTrim()
	name?: string;
	@AutoTrim()
	@IsUrl()
	image?: string;
	@AutoTrim()
	gender?: genderUserEnum | null;
	@AutoTrim()
	@IsEmail()
	email?: string;
	@AutoTrim()
	dateOfBirth?: Date | null;
	@AutoTrim()
	@IsPhoneNumber('VN')
	phoneNumber?: string | null;
	@AutoTrim()
	address?: string | null;
}
