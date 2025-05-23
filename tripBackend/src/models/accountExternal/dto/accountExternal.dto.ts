import { AccountExternalStatusEnum, ProviderAccountExternalEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AccountExternalDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
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
