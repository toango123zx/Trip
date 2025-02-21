import { ApiProperty } from '@nestjs/swagger';

import { transactionStatusEnum, transactionTargetEnum } from '@prisma/client';

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
		enum: transactionTargetEnum,
		enumName: 'transactionTargetEnum',
	})
	transactionTarget: transactionTargetEnum;
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
		enum: transactionStatusEnum,
		enumName: 'transactionStatusEnum',
	})
	status: transactionStatusEnum;
	@ApiProperty({
		type: () => BillEntity,
		isArray: true,
		required: false,
	})
	bill?: BillEntity[];
}
