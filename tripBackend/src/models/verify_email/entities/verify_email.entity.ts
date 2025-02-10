import { ApiProperty } from '@nestjs/swagger';

import { verifyEmailStatusEnum } from '@prisma/client';

import { AccountEntity } from '../../account/entities/account.entity';

export class VerifyEmailEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	content: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	duration: Date;
	@ApiProperty({
		type: 'string',
	})
	accountId: string;
	@ApiProperty({
		type: () => AccountEntity,
		required: false,
	})
	account?: AccountEntity;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	createAt: Date;
	@ApiProperty({
		enum: verifyEmailStatusEnum,
	})
	status: verifyEmailStatusEnum;
}
