import { ApiProperty } from '@nestjs/swagger';

import { accountExternalStatusEnum, providerAccountExternalEnum } from '@prisma/client';

export class AccountExternalDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
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
