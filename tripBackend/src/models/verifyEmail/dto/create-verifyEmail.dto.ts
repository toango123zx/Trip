import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { ConnectAccountDto } from '../../account/dto/connect-account.dto';

export class CreateVerifyEmailAccountRelationInputDto {
	@ApiProperty({
		type: ConnectAccountDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectAccountDto)
	connect: ConnectAccountDto;
}

@ApiExtraModels(ConnectAccountDto, CreateVerifyEmailAccountRelationInputDto)
export class CreateVerifyEmailDto {
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	content: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	@IsNotEmpty()
	@IsDateString()
	duration: Date;
	@ApiProperty({
		type: CreateVerifyEmailAccountRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateVerifyEmailAccountRelationInputDto)
	account: CreateVerifyEmailAccountRelationInputDto;
}
