import { ApiProperty } from '@nestjs/swagger';

import { IsArray, ArrayNotEmpty } from 'class-validator';

export class DeleteProductSchedulesToDiscountRequestDto {
	@ApiProperty({
		type: 'array',
		items: { type: 'string' },
		required: true,
	})
	@IsArray()
	@ArrayNotEmpty()
	scheduleIds: string[];
}
