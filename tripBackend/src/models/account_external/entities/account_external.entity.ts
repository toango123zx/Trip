import { ApiProperty } from '@nestjs/swagger';

import { accountExternalStatusEnum, providerAccountExternalEnum } from '@prisma/client';

import { UserEntity } from '../../user/entities/user.entity';

export class AccountExternalEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
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
		enum: providerAccountExternalEnum,
		enumName: 'providerAccountExternalEnum',
	})
	providerAccountExternal: providerAccountExternalEnum;
	@ApiProperty({
		type: 'string',
	})
	providerToken: string;
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
		enum: accountExternalStatusEnum,
		enumName: 'accountExternalStatusEnum',
	})
	status: accountExternalStatusEnum;
}
