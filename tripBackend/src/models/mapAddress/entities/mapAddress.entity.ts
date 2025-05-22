import { MapAddressStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ProviderMapEntity } from '../../providerMap/entities/providerMap.entity';
import { LocationEntity } from '../../location/entities/location.entity';

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
	})
	productId: string;
	@ApiProperty({
		type: () => ProductEntity,
		required: false,
	})
	product?: ProductEntity;
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
