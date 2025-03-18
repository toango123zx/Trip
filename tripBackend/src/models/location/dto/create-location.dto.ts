import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { CityEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { ConnectMapAddressDto } from '../../map_address/dto/connect-map_address.dto';

export class CreateLocationMapAddressRelationInputDto {
	@ApiProperty({
		type: ConnectMapAddressDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectMapAddressDto)
	connect: ConnectMapAddressDto;
}

@ApiExtraModels(ConnectMapAddressDto, CreateLocationMapAddressRelationInputDto)
export class CreateLocationDto {
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	systemName: string;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	displayName: string;
	@ApiProperty({
		enum: CityEnum,
		enumName: 'CityEnum',
	})
	@IsNotEmpty()
	city: CityEnum;
	@ApiProperty({
		type: CreateLocationMapAddressRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateLocationMapAddressRelationInputDto)
	mapAddress: CreateLocationMapAddressRelationInputDto;
}
