import { ApiProperty } from '@nestjs/swagger';

import { ProductScheduleEntity } from '../../productSchedule/entities/productSchedule.entity';
import { UserEntity } from '../../user/entities/user.entity';

export class CartEntity {
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
	productScheduleId: string;
	@ApiProperty({
		type: () => ProductScheduleEntity,
		required: false,
	})
	productSchedule?: ProductScheduleEntity;
}
