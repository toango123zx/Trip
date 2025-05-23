import { ApiProperty } from '@nestjs/swagger';

import { ProductRateStatusEnum } from '@prisma/client';

import { ProductEntity } from '../../product/entities/product.entity';
import { UserEntity } from '../../user/entities/user.entity';

export class ProductRateEntity {
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
	userId: string;
	@ApiProperty({
		type: () => UserEntity,
		required: false,
	})
	user?: UserEntity;
	@ApiProperty({
		minimum: 0,
		maximum: 5,
		type: 'integer',
		format: 'int32',
	})
	star: number;
	@ApiProperty({
		type: 'string',
	})
	comment: string;
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
		enum: ProductRateStatusEnum,
		enumName: 'ProductRateStatusEnum',
	})
	status: ProductRateStatusEnum;
}
