import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { AutoTrim } from 'src/common/decorators';

export class CreateProductRateByProductIdRequestDto {
	@ApiProperty({
		type: 'number',
		required: true,
	})
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(5)
	star: number;
	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	comment: string;
}
