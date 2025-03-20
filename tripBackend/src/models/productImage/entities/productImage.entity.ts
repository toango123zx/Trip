import { ApiProperty } from '@nestjs/swagger';

import { ProductEntity } from '../../product/entities/product.entity';

export class ProductImageEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
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
	})
	url: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	createdAt: Date;
}
