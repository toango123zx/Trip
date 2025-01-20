import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from '../../product/entities/product.entity';

export class ProdcutImageEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	product_id: string;
	@ApiProperty({
		type: () => ProductEntity,
		required: false,
	})
	Product?: ProductEntity;
	@ApiProperty({
		type: 'string',
	})
	url: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	create_at: Date;
}
