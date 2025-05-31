import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateProductRateDto {
	@ApiProperty({
		minimum: 0,
		maximum: 5,
		type: 'integer',
		format: 'int32',
		required: false,
	})
	@IsOptional()
	@IsInt()
	star?: number;
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	comment?: string;
}
