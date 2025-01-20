import { cityEnum, locationStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { MapAddressEntity } from '../../map_address/entities/map_address.entity';
import { ProductEntity } from '../../product/entities/product.entity';

export class LocationEntity {
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
	})
	mapAddressId: string;
	@ApiProperty({
		type: () => MapAddressEntity,
		required: false,
	})
	mapAddress?: MapAddressEntity;
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
	@ApiProperty({
		type: () => ProductEntity,
		isArray: true,
		required: false,
	})
	product?: ProductEntity[];
}
