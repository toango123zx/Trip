import { ApiProperty } from '@nestjs/swagger';

export class ProdcutImageDto {
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
	create_at: Date;
}
