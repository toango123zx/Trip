import { cityEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLocationDto {
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	systemName?: string;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	displayName?: string;
	@ApiProperty({
		enum: cityEnum,
		required: false,
	})
	@IsOptional()
	city?: cityEnum;
}
