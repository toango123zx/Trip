import { ApiProperty } from '@nestjs/swagger';

import { providerAccountExternalEnum, accountExternalStatusEnum } from '@prisma/client';

import { UserEntity } from '../../user/entities/user.entity';

export class AccountExternalEntity {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	user_id: string;
	@ApiProperty({
		type: () => UserEntity,
		required: false,
	})
	user?: UserEntity;
	@ApiProperty({
		enum: providerAccountExternalEnum,
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
	})
	status: accountExternalStatusEnum;
}
