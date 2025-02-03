import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { providerAccountExternalEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { ConnectUserDto } from '../../user/dto/connect-user.dto';

export class CreateAccountExternalUserRelationInputDto {
	@ApiProperty({
		type: ConnectUserDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectUserDto)
	connect: ConnectUserDto;
}

@ApiExtraModels(ConnectUserDto, CreateAccountExternalUserRelationInputDto)
export class CreateAccountExternalDto {
	@ApiProperty({
		type: CreateAccountExternalUserRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateAccountExternalUserRelationInputDto)
	user: CreateAccountExternalUserRelationInputDto;
	@ApiProperty({
		enum: providerAccountExternalEnum,
	})
	@IsNotEmpty()
	providerAccountExternal: providerAccountExternalEnum;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	providerToken: string;
}
