import { ApiProperty } from '@nestjs/swagger';

import { TransactionStatusEnum, TransactionTargetEnum } from '@prisma/client';

import { BillEntity } from '../../bill/entities/bill.entity';
import { PaymentMethodEntity } from '../../paymentMethod/entities/paymentMethod.entity';

export class TransactionEntity {
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
	transactionSessionCode: string;
	@ApiProperty({
		type: 'string',
	})
	paymentMethodId: string;
	@ApiProperty({
		type: () => PaymentMethodEntity,
		required: false,
	})
	paymentMethod?: PaymentMethodEntity;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	amount: number;
	@ApiProperty({
		type: 'string',
	})
	bankCode: string;
	@ApiProperty({
		type: 'string',
	})
	cardType: string;
	@ApiProperty({
		type: 'string',
	})
	description: string;
	@ApiProperty({
		type: 'string',
	})
	BankTransactionCode: string;
	@ApiProperty({
		type: 'string',
	})
	transactionCode: string;
	@ApiProperty({
		enum: TransactionTargetEnum,
		enumName: 'TransactionTargetEnum',
	})
	transactionTarget: TransactionTargetEnum;
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
		enum: TransactionStatusEnum,
		enumName: 'TransactionStatusEnum',
	})
	status: TransactionStatusEnum;
}
