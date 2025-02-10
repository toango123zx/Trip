import { ApiProperty } from '@nestjs/swagger';

import { accountStatusEnum } from '@prisma/client';

import { UserEntity } from '../../user/entities/user.entity';
import { VerifyEmailEntity } from '../../verify_email/entities/verify_email.entity';

export class AccountEntity {
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
	})
	userId: string;
	@ApiProperty({
		type: () => UserEntity,
		required: false,
	})
	user?: UserEntity;
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
	})
	status: accountStatusEnum;
	@ApiProperty({
		type: () => VerifyEmailEntity,
		isArray: true,
		required: false,
	})
	verifyEmail?: VerifyEmailEntity[];
}
