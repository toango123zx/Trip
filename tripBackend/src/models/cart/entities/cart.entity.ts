import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { ProductScheduleEntity } from '../../productSchedule/entities/productSchedule.entity';

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
