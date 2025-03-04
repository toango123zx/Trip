import { OmitType } from '@nestjs/swagger';

import { genderUserEnum } from '@prisma/client';
import { IsEmail, IsPhoneNumber, IsUrl } from 'class-validator';
import { AutoTrim } from 'src/common/decorators';
import { UpdateUserDto } from 'src/models';

export class UpdateMyInformationRequestDto extends OmitType(UpdateUserDto, ['role']) {
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
