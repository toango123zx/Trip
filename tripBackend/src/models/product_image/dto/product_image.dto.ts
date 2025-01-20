import { ApiProperty } from '@nestjs/swagger';

export class ProductImageDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	url: string;
	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	createdAt: Date;
}
