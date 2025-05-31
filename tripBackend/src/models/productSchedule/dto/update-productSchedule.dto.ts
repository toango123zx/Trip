import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class UpdateProductScheduleDto {
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		required: false,
	})
	@IsOptional()
	@IsDateString()
	startTime?: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		required: false,
	})
	@IsOptional()
	@IsDateString()
	endTime?: Date;
	@ApiProperty({
		minimum: 1,
		type: 'integer',
		format: 'int32',
		required: false,
	})
	@IsOptional()
	@IsInt()
	price?: number;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		required: false,
	})
	@IsOptional()
	@IsDateString()
	startOrder?: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		required: false,
	})
	@IsOptional()
	@IsDateString()
	endOrder?: Date;
}
