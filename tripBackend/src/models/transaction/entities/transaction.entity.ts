import { TransactionStatusEnum, TransactionTargetEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { BillEntity } from '../../bill/entities/bill.entity';

export class TransactionEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	code: string;
	@ApiProperty({
		type: 'string',
	})
	description: string;
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
	@ApiProperty({
		type: () => BillEntity,
		isArray: true,
		required: false,
	})
	bill?: BillEntity[];
}
