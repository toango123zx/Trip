import { TransactionStatusEnum, TransactionTargetEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	transactionSessionCode: string;
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
