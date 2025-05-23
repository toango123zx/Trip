import { PaymentMethodStatusEnum } from '@prisma/client';
import { TransactionEntity } from '../../transaction/entities/transaction.entity';
import { TransactionSessionEntity } from '../../transactionSession/entities/transactionSession.entity';
import { ApiProperty } from '@nestjs/swagger';
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
		enum: PaymentMethodStatusEnum,
		enumName: 'PaymentMethodStatusEnum',
	})
	status: PaymentMethodStatusEnum;
	@ApiProperty({
		type: () => TransactionEntity,
		isArray: true,
		required: false,
	})
	transaction?: TransactionEntity[];
	@ApiProperty({
		type: () => TransactionSessionEntity,
		isArray: true,
		required: false,
	})
	transactionSession?: TransactionSessionEntity[];
}
