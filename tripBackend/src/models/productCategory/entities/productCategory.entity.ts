import { ProductStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from '../../product/entities/product.entity';

export class ProductCategoryEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	name: string;
	@ApiProperty({
		type: 'string',
	})
	description: string;
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
		enum: ProductStatusEnum,
		enumName: 'ProductStatusEnum',
	})
	status: ProductStatusEnum;
	@ApiProperty({
		type: () => ProductEntity,
		isArray: true,
		required: false,
	})
	product?: ProductEntity[];
}
