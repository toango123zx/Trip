import { ApiProperty } from '@nestjs/swagger';

import { TransactionTargetEnum } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTransactionDto {
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	code: string;
	@ApiProperty({
		type: 'string',
	})
	@IsNotEmpty()
	@IsString()
	description: string;
	@ApiProperty({
		enum: TransactionTargetEnum,
		enumName: 'TransactionTargetEnum',
	})
	@IsNotEmpty()
	transactionTarget: TransactionTargetEnum;
}
