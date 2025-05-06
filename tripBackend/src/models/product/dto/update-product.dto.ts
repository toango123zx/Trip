import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { AutoTrim } from 'src/common/decorators';

export class UpdateProductDto {
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	@AutoTrim()
	name?: string;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	@AutoTrim()
	posterImageUrl?: string;
	@ApiProperty({
		minimum: 0.01,
		type: 'number',
		format: 'float',
		required: false,
	})
	@IsOptional()
	@IsNumber()
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
	@AutoTrim()
	description?: string;
}
