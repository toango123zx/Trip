import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectProviderMapDto } from '../../providerMap/dto/connect-providerMap.dto';
import { CreateLocationDto } from '../../location/dto/create-location.dto';

export class CreateMapAddressProviderMapRelationInputDto {
	@ApiProperty({
		type: ConnectProviderMapDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectProviderMapDto)
	connect: ConnectProviderMapDto;
}

@ApiExtraModels(ConnectProviderMapDto, CreateMapAddressProviderMapRelationInputDto)
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
}
