import { AccountExternalStatusEnum, ProviderAccountExternalEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
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
		enum: ProviderAccountExternalEnum,
		enumName: 'ProviderAccountExternalEnum',
	})
	providerAccountExternal: ProviderAccountExternalEnum;
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
		enum: AccountExternalStatusEnum,
		enumName: 'AccountExternalStatusEnum',
	})
	status: AccountExternalStatusEnum;
}
