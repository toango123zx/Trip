import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { ConnectDiscountDto } from '../../discount/dto/connect-discount.dto';
import { ConnectProductScheduleDto } from '../../productSchedule/dto/connect-productSchedule.dto';

export class CreateInfoDiscountDiscountRelationInputDto {
	@ApiProperty({
		type: ConnectDiscountDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectDiscountDto)
	connect: ConnectDiscountDto;
}
export class CreateInfoDiscountProductScheduleRelationInputDto {
	@ApiProperty({
		type: ConnectProductScheduleDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectProductScheduleDto)
	connect: ConnectProductScheduleDto;
}

@ApiExtraModels(
	ConnectDiscountDto,
	CreateInfoDiscountDiscountRelationInputDto,
	ConnectProductScheduleDto,
	CreateInfoDiscountProductScheduleRelationInputDto,
)
export class CreateInfoDiscountDto {
	@ApiProperty({
		type: CreateInfoDiscountDiscountRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateInfoDiscountDiscountRelationInputDto)
	discount: CreateInfoDiscountDiscountRelationInputDto;
	@ApiProperty({
		type: CreateInfoDiscountProductScheduleRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateInfoDiscountProductScheduleRelationInputDto)
	productSchedule: CreateInfoDiscountProductScheduleRelationInputDto;
}
