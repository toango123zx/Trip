import { ApiProperty } from '@nestjs/swagger';
import { BillEntity } from '../../bill/entities/bill.entity';
import { ProductScheduleEntity } from '../../product_schedule/entities/product_schedule.entity';

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
	Product_Schedule?: ProductScheduleEntity;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	quantity: number;
}
