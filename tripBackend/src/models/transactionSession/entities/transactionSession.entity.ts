import { ApiProperty } from '@nestjs/swagger';

import { BillEntity } from '../../bill/entities/bill.entity';
import { PaymentMethodEntity } from '../../paymentMethod/entities/paymentMethod.entity';

export class TransactionSessionEntity {
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
	paymentMethodId: string;
	@ApiProperty({
		type: () => PaymentMethodEntity,
		required: false,
	})
	paymentMethod?: PaymentMethodEntity;
}
