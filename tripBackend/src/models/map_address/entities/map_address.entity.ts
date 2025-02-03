import { ApiProperty } from '@nestjs/swagger';

import { mapAddressStatusEnum } from '@prisma/client';

import { LocationEntity } from '../../location/entities/location.entity';
import { ProviderMapEntity } from '../../provider_map/entities/provider_map.entity';

export class MapAddressEntity {
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
	})
	providerMapId: string;
	@ApiProperty({
		type: () => ProviderMapEntity,
		required: false,
	})
	providerMap?: ProviderMapEntity;
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
	})
	mapAddressStatus: mapAddressStatusEnum;
	@ApiProperty({
		type: () => LocationEntity,
		required: false,
		nullable: true,
	})
	location?: LocationEntity | null;
}
