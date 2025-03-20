import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator';
import { AutoTrim, IsAfterToday } from 'src/common/decorators';

export class CreateProdcutScheduleByProductIdRequestDto {
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	@IsNotEmpty()
	@AutoTrim()
	@IsDateString()
	@IsAfterToday()
	startTime: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	@IsNotEmpty()
	@AutoTrim()
	@IsDateString()
	@IsAfterToday()
	endTime: Date;
	@ApiProperty({
		minimum: 1,
		type: 'integer',
		format: 'int32',
	})
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	price: number;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	@IsNotEmpty()
	@AutoTrim()
	@IsDateString()
	startOrder: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	@IsNotEmpty()
	@AutoTrim()
	@IsDateString()
	@IsAfterToday()
	endOrder: Date;
}
