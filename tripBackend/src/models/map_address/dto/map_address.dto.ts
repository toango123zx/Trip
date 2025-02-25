import { ApiProperty } from '@nestjs/swagger';

import { mapAddressStatusEnum } from '@prisma/client';

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
		enum: mapAddressStatusEnum,
		enumName: 'mapAddressStatusEnum',
	})
	mapAddressStatus: mapAddressStatusEnum;
}
