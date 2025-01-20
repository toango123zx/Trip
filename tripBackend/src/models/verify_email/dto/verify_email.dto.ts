import { verifyEmailStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

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
		enum: verifyEmailStatusEnum,
	})
	status: verifyEmailStatusEnum;
}
