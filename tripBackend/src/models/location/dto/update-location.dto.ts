import { ApiProperty } from '@nestjs/swagger';

import { CityEnum } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLocationDto {
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	systemName?: string;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	displayName?: string;
	@ApiProperty({
		enum: CityEnum,
		enumName: 'CityEnum',
		required: false,
	})
	@IsOptional()
	city?: CityEnum;
}
