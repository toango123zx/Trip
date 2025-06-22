import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateWithdrawalBillRequestDto {
	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	bankName: string;
	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	bankCode: string;
	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsNumber()
	amount: number;
}
