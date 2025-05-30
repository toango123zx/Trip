import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class SearchDto {
	@ApiProperty({
		required: false,
		nullable: true,
		type: String,
	})
	@IsOptional()
	@IsString()
	keyword?: string;
}
