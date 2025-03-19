import { ApiProperty } from '@nestjs/swagger';

import { BillEntity } from '../../bill/entities/bill.entity';
import { ProductScheduleEntity } from '../../productSchedule/entities/productSchedule.entity';

export class InfoBillEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	billId: string;
	@ApiProperty({
		type: () => BillEntity,
		required: false,
	})
	bill?: BillEntity;
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
		type: 'integer',
		format: 'int32',
	})
	quantity: number;
}
