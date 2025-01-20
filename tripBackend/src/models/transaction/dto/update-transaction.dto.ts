import { transactionTargetEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
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
		enum: transactionTargetEnum,
		required: false,
	})
	@IsOptional()
	transactionTarget?: transactionTargetEnum;
}
