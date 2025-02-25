import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class ResetUserPasswordResponseDto {
	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	userId: string;
	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	password: string;
}
