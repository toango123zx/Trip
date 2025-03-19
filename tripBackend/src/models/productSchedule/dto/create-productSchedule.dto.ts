import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';

import { ConnectProductDto } from '../../product/dto/connect-product.dto';

export class CreateProductScheduleProductRelationInputDto {
	@ApiProperty({
		type: ConnectProductDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ConnectProductDto)
	connect: ConnectProductDto;
}

@ApiExtraModels(ConnectProductDto, CreateProductScheduleProductRelationInputDto)
export class CreateProductScheduleDto {
	@ApiProperty({
		type: CreateProductScheduleProductRelationInputDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateProductScheduleProductRelationInputDto)
	product: CreateProductScheduleProductRelationInputDto;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	@IsNotEmpty()
	@IsDateString()
	startTime: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	@IsNotEmpty()
	@IsDateString()
	endTime: Date;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	price: number;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	booked: number;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	@IsNotEmpty()
	@IsDateString()
	startOrder: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	@IsNotEmpty()
	@IsDateString()
	endOrder: Date;
}
