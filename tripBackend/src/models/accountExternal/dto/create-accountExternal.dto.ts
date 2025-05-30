import { ProviderAccountExternalEnum } from '@prisma/client';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
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
		enum: ProviderAccountExternalEnum,
		enumName: 'ProviderAccountExternalEnum',
	})
	@IsNotEmpty()
	providerAccountExternal: ProviderAccountExternalEnum;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	providerToken: string;
}
