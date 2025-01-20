import { infoDiscountStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { DiscountEntity } from '../../discount/entities/discount.entity';
import { ProductScheduleEntity } from '../../product_schedule/entities/product_schedule.entity';

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
	Product_Schedule?: ProductScheduleEntity;
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
		enum: infoDiscountStatusEnum,
	})
	status: infoDiscountStatusEnum;
}
