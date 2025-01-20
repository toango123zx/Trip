import { ApiProperty } from '@nestjs/swagger';

export class InfoBillDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'integer',
		format: 'int32',
	})
	quantity: number;
}
