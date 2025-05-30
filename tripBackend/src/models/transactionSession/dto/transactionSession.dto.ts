import { ApiProperty } from '@nestjs/swagger';

export class TransactionSessionDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
}
