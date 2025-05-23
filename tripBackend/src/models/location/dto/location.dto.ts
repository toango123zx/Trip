import { CityEnum, LocationStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

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
		enum: CityEnum,
		enumName: 'CityEnum',
	})
	city: CityEnum;
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
		enum: LocationStatusEnum,
		enumName: 'LocationStatusEnum',
	})
	status: LocationStatusEnum;
}
