import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';

import { ConnectProductScheduleDto } from '../../productSchedule/dto/connect-productSchedule.dto';

export class CreateInfoBillProductScheduleRelationInputDto {
	@ApiProperty({
		type: ConnectProductScheduleDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectProductScheduleDto)
	connect: ConnectProductScheduleDto;
}

@ApiExtraModels(ConnectProductScheduleDto, CreateInfoBillProductScheduleRelationInputDto)
export class CreateInfoBillDto {
	@ApiProperty({
		type: CreateInfoBillProductScheduleRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateInfoBillProductScheduleRelationInputDto)
	productSchedule: CreateInfoBillProductScheduleRelationInputDto;
	@ApiProperty({
		minimum: 0,
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	quantity: number;
}
