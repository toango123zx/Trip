import { MapAddressStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class MapAddressDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	urlMap: string;
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
		enum: MapAddressStatusEnum,
		enumName: 'MapAddressStatusEnum',
	})
	status: MapAddressStatusEnum;
}
