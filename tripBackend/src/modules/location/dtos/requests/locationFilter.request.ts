import { ApiProperty } from '@nestjs/swagger';

import { CountryEnum, LocationStatusEnum } from '@prisma/client';
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
		enum: CountryEnum,
		required: false,
	})
	@IsOptional()
	@IsEnum(CountryEnum)
	city?: CountryEnum;
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
