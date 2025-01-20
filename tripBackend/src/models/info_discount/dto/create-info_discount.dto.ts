import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectDiscountDto } from '../../discount/dto/connect-discount.dto';
import { ConnectProductScheduleDto } from '../../product_schedule/dto/connect-product_schedule.dto';

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
	Product_Schedule: CreateInfoDiscountProductScheduleRelationInputDto;
}
