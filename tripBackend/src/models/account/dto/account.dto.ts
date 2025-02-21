import { ApiProperty } from '@nestjs/swagger';

import { accountStatusEnum } from '@prisma/client';

export class AccountDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	username: string;
	@ApiProperty({
		type: 'string',
	})
	password: string;
	@ApiProperty({
		type: 'string',
	})
	salt: string;
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
		enum: accountStatusEnum,
		enumName: 'accountStatusEnum',
	})
	status: accountStatusEnum;
}
