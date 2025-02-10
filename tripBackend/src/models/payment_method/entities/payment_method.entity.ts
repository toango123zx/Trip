import { ApiProperty } from '@nestjs/swagger';

import { paymentMethodStatusEnum } from '@prisma/client';

import { BillEntity } from '../../bill/entities/bill.entity';

export class PaymentMethodEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	name: string;
	@ApiProperty({
		type: 'string',
	})
	description: string;
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
		enum: paymentMethodStatusEnum,
	})
	status: paymentMethodStatusEnum;
	@ApiProperty({
		type: () => BillEntity,
		isArray: true,
		required: false,
	})
	bill?: BillEntity[];
}
