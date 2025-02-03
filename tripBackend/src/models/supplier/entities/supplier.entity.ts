import { ApiProperty } from '@nestjs/swagger';

import { ProductEntity } from '../../product/entities/product.entity';
import { UserEntity } from '../../user/entities/user.entity';

export class SupplierEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
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
		type: 'string',
	})
	taxId: string;
	@ApiProperty({
		minimum: 1,
		maximum: 14,
		type: 'integer',
		format: 'int32',
	})
	fee: number;
	@ApiProperty({
		type: () => ProductEntity,
		isArray: true,
		required: false,
	})
	product?: ProductEntity[];
}
