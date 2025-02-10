import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from './pagination.dto';

export class SearchDto<T> extends PaginationDto {
	@ApiProperty({
		required: false,
		nullable: true,
		type: String,
	})
	@IsOptional()
	@IsString()
	keyword?: string;
	@ApiProperty({
		required: false,
		nullable: true,
		type: Object,
	})
	@IsOptional()
	filters?: Record<string, T>;
}
