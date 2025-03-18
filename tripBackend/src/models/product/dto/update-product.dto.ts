import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	name?: string;
	@ApiProperty({
		minimum: 0.01,
		type: 'integer',
		format: 'int32',
		required: false,
	})
	@IsOptional()
	@IsInt()
	time?: number;
	@ApiProperty({
		minimum: 1,
		type: 'integer',
		format: 'int32',
		required: false,
	})
	@IsOptional()
	@IsInt()
	quantityAvailable?: number;
	@ApiProperty({
		minimum: 0,
		type: 'integer',
		format: 'int32',
		required: false,
	})
	@IsOptional()
	@IsInt()
	age?: number;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	description?: string;
}
