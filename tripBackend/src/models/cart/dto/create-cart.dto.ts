import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectUserDto } from '../../user/dto/connect-user.dto';
import { ConnectProductScheduleDto } from '../../product_schedule/dto/connect-product_schedule.dto';

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
