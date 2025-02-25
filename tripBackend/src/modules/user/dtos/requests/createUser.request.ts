import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from 'src/common';
import { RegisterRequestDto } from 'src/modules/auth/dtos';

export class CreateUserRequestDto extends RegisterRequestDto {
	@ApiProperty({
		type: 'string',
		enum: RoleEnum,
		required: false,
		default: RoleEnum.Tourist,
	})
	@IsOptional()
	@IsString()
	@IsEnum(RoleEnum)
	roleName: RoleEnum;
}
