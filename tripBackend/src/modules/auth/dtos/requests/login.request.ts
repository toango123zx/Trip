import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginRequestDto {
	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@Transform(({ value }) => value.trim().toLowerCase())
	username: string;
	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/, {
		message:
			'Password must contain at least 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character',
	})
	password: string;
}
