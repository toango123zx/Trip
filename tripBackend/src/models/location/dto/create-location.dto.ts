import { CityEnum } from '@prisma/client';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectMapAddressDto } from '../../mapAddress/dto/connect-mapAddress.dto';

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
}
