import { ApiProperty } from '@nestjs/swagger';

export class SupplierDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	taxId: string;
	@ApiProperty({
		minimum: 1,
		maximum: 14,
		type: 'integer',
		format: 'int32',
	})
	fee: number;
}
