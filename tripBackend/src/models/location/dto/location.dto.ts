import { ApiProperty } from '@nestjs/swagger';

import { cityEnum, locationStatusEnum } from '@prisma/client';

export class LocationDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	systemName: string;
	@ApiProperty({
		type: 'string',
	})
	displayName: string;
	@ApiProperty({
		enum: cityEnum,
	})
	city: cityEnum;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	createAt: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	updateAt: Date;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
		nullable: true,
	})
	deletedAt: Date | null;
	@ApiProperty({
		enum: locationStatusEnum,
	})
	status: locationStatusEnum;
}
