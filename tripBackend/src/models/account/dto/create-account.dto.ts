import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { CreateUserDto } from '../../user/dto/create-user.dto';

export class CreateAccountUserRelationInputDto {
	@ApiProperty({
		type: CreateUserDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateUserDto)
	create: CreateUserDto;
}

@ApiExtraModels(CreateUserDto, CreateAccountUserRelationInputDto)
export class CreateAccountDto {
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	username: string;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	password: string;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	salt: string;
	@ApiProperty({
		type: CreateAccountUserRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateAccountUserRelationInputDto)
	user: CreateAccountUserRelationInputDto;
}
