import { AccountStatusEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { VerifyEmailEntity } from '../../verifyEmail/entities/verifyEmail.entity';

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
		enum: AccountStatusEnum,
		enumName: 'AccountStatusEnum',
	})
	status: AccountStatusEnum;
	@ApiProperty({
		type: () => VerifyEmailEntity,
		isArray: true,
		required: false,
	})
	verifyEmail?: VerifyEmailEntity[];
}
