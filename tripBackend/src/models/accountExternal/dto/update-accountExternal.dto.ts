import { ApiProperty } from '@nestjs/swagger';

import { ProviderAccountExternalEnum } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAccountExternalDto {
	@ApiProperty({
		enum: ProviderAccountExternalEnum,
		enumName: 'ProviderAccountExternalEnum',
		required: false,
	})
	@IsOptional()
	providerAccountExternal?: ProviderAccountExternalEnum;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	providerToken?: string;
}
