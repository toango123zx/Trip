import { ApiProperty } from '@nestjs/swagger';

import { TransactionTargetEnum } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTransactionDto {
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	description?: string;
	@ApiProperty({
		enum: TransactionTargetEnum,
		enumName: 'TransactionTargetEnum',
		required: false,
	})
	@IsOptional()
	transactionTarget?: TransactionTargetEnum;
}
