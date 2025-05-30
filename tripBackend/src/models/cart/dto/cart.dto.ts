import { ApiProperty } from '@nestjs/swagger';

export class CartDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
}
