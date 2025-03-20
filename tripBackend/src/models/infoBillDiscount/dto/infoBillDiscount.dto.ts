import { ApiProperty } from '@nestjs/swagger';

export class InfoBillDiscountDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
}
