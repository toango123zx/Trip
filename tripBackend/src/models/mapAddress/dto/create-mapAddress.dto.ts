import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CreateLocationDto } from '../../location/dto/create-location.dto';
import { ConnectProviderMapDto } from '../../providerMap/dto/connect-providerMap.dto';

export class CreateMapAddressProviderMapRelationInputDto {
	@ApiProperty({
		type: ConnectProviderMapDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectProviderMapDto)
	connect: ConnectProviderMapDto;
}
export class CreateMapAddressLocationRelationInputDto {
	@ApiProperty({
		type: CreateLocationDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateLocationDto)
	create: CreateLocationDto;
}

@ApiExtraModels(
	ConnectProviderMapDto,
	CreateMapAddressProviderMapRelationInputDto,
	CreateLocationDto,
	CreateMapAddressLocationRelationInputDto,
)
export class CreateMapAddressDto {
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	urlMap: string;
	@ApiProperty({
		type: CreateMapAddressProviderMapRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateMapAddressProviderMapRelationInputDto)
	providerMap: CreateMapAddressProviderMapRelationInputDto;
	@ApiProperty({
		required: false,
		nullable: true,
		type: CreateMapAddressLocationRelationInputDto,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateMapAddressLocationRelationInputDto)
	location?: CreateMapAddressLocationRelationInputDto | null;
}
