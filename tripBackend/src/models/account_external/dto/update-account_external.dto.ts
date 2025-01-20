import { providerAccountExternalEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAccountExternalDto {
	@ApiProperty({
		enum: providerAccountExternalEnum,
		required: false,
	})
	@IsOptional()
	providerAccountExternal?: providerAccountExternalEnum;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	providerToken?: string;
}
