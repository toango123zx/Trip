import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { ConnectUserDto } from '../../user/dto/connect-user.dto';

export class CreateSupplierUserRelationInputDto {
	@ApiProperty({
		type: ConnectUserDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectUserDto)
	connect: ConnectUserDto;
}

@ApiExtraModels(ConnectUserDto, CreateSupplierUserRelationInputDto)
export class CreateSupplierDto {
	@ApiProperty({
		type: CreateSupplierUserRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateSupplierUserRelationInputDto)
	user: CreateSupplierUserRelationInputDto;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	taxId: string;
}
