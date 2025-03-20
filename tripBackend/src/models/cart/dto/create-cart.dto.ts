import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { ConnectProductScheduleDto } from '../../productSchedule/dto/connect-productSchedule.dto';
import { ConnectUserDto } from '../../user/dto/connect-user.dto';

export class CreateCartUserRelationInputDto {
	@ApiProperty({
		type: ConnectUserDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectUserDto)
	connect: ConnectUserDto;
}
export class CreateCartProductScheduleRelationInputDto {
	@ApiProperty({
		type: ConnectProductScheduleDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectProductScheduleDto)
	connect: ConnectProductScheduleDto;
}

@ApiExtraModels(
	ConnectUserDto,
	CreateCartUserRelationInputDto,
	ConnectProductScheduleDto,
	CreateCartProductScheduleRelationInputDto,
)
export class CreateCartDto {
	@ApiProperty({
		type: CreateCartUserRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateCartUserRelationInputDto)
	user: CreateCartUserRelationInputDto;
	@ApiProperty({
		type: CreateCartProductScheduleRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateCartProductScheduleRelationInputDto)
	productSchedule: CreateCartProductScheduleRelationInputDto;
}
