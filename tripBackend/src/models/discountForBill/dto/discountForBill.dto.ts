import { ApiProperty } from '@nestjs/swagger';

export class DiscountForBillDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
}
