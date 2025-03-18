import { ApiProperty } from '@nestjs/swagger';

import { VerifyEmailStatusEnum } from '@prisma/client';

export class VerifyEmailDto {
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
		format: 'date-time',
	})
	createAt: Date;
	@ApiProperty({
		enum: VerifyEmailStatusEnum,
		enumName: 'VerifyEmailStatusEnum',
	})
	status: VerifyEmailStatusEnum;
}
