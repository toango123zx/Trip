import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatisticTimeUnitEnum } from 'src/common';
import { AutoTrim } from 'src/common/decorators';

export class GetStatisticRequestDto {
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	@AutoTrim()
	productId: string;

	@ApiProperty({
		type: 'string',
		enum: StatisticTimeUnitEnum,
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	@IsEnum(StatisticTimeUnitEnum)
	timeUnit: StatisticTimeUnitEnum;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@Type(() => Date)
	@IsDate()
	startTimeSearch?: Date;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@Type(() => Date)
	@IsDate()
	endTimeSearch?: Date;
}
