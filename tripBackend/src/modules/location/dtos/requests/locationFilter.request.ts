import { ApiProperty } from '@nestjs/swagger';

import { CityEnum, LocationStatusEnum } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderByEnum, SearchDto } from 'src/common';

export class LocationFilterRequestDto extends SearchDto {
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsEnum(OrderByEnum)
	systemName?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsEnum(OrderByEnum)
	displayName?: OrderByEnum;
	@ApiProperty({
		type: 'string',
		enum: CityEnum,
		required: false,
	})
	@IsOptional()
	@IsEnum(CityEnum)
	city?: CityEnum;
	@ApiProperty({
		type: 'string',
		enum: LocationStatusEnum,
		required: false,
	})
	@IsOptional()
	@IsEnum(LocationStatusEnum)
	locationStatus?: LocationStatusEnum;
	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsEnum(OrderByEnum)
	status?: OrderByEnum;
}
