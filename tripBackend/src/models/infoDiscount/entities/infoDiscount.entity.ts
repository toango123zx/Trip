import { ApiProperty } from '@nestjs/swagger';

import { InfoDiscountStatusEnum } from '@prisma/client';

import { DiscountEntity } from '../../discount/entities/discount.entity';
import { ProductScheduleEntity } from '../../productSchedule/entities/productSchedule.entity';

export class InfoDiscountEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	discountId: string;
	@ApiProperty({
		type: () => DiscountEntity,
		required: false,
	})
	discount?: DiscountEntity;
	@ApiProperty({
		type: 'string',
	})
	productScheduleId: string;
	@ApiProperty({
		type: () => ProductScheduleEntity,
		required: false,
	})
	product_Schedule?: ProductScheduleEntity;
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
		enum: InfoDiscountStatusEnum,
		enumName: 'InfoDiscountStatusEnum',
	})
	status: InfoDiscountStatusEnum;
}
