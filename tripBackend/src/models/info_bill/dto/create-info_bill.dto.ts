import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectBillDto } from '../../bill/dto/connect-bill.dto';
import { ConnectProductScheduleDto } from '../../product_schedule/dto/connect-product_schedule.dto';

export class CreateInfoBillBillRelationInputDto {
	@ApiProperty({
		type: ConnectBillDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectBillDto)
	connect: ConnectBillDto;
}
export class CreateInfoBillProductScheduleRelationInputDto {
	@ApiProperty({
		type: ConnectProductScheduleDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectProductScheduleDto)
	connect: ConnectProductScheduleDto;
}

@ApiExtraModels(
	ConnectBillDto,
	CreateInfoBillBillRelationInputDto,
	ConnectProductScheduleDto,
	CreateInfoBillProductScheduleRelationInputDto,
)
export class CreateInfoBillDto {
	@ApiProperty({
		type: CreateInfoBillBillRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateInfoBillBillRelationInputDto)
	bill: CreateInfoBillBillRelationInputDto;
	@ApiProperty({
		type: CreateInfoBillProductScheduleRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateInfoBillProductScheduleRelationInputDto)
	Product_Schedule: CreateInfoBillProductScheduleRelationInputDto;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	quantity: number;
}
