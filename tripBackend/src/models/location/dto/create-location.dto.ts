import { ApiProperty } from '@nestjs/swagger';

import { CityEnum } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationDto {
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	systemName: string;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	displayName: string;
	@ApiProperty({
		enum: CityEnum,
		enumName: 'CityEnum',
	})
	@IsNotEmpty()
	city: CityEnum;
}
