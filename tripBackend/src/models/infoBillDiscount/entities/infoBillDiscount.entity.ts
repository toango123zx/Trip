import { ApiProperty } from '@nestjs/swagger';
import { BillEntity } from '../../bill/entities/bill.entity';
import { DiscountEntity } from '../../discount/entities/discount.entity';

export class InfoBillDiscountEntity {
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
	discountId: string;
	@ApiProperty({
		type: () => DiscountEntity,
		required: false,
	})
	discount?: DiscountEntity;
}
