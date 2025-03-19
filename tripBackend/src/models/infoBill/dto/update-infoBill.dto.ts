import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsOptional } from 'class-validator';

export class UpdateInfoBillDto {
	@ApiProperty({
		type: 'integer',
		format: 'int32',
		required: false,
	})
	@IsOptional()
	@IsInt()
	quantity?: number;
}
