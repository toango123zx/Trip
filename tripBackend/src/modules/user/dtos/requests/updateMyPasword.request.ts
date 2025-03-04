import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdateMyPasswordRequestDto {
	@ApiProperty({
		type: String,
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	currentPassword: string;
	@ApiProperty({
		type: String,
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/, {
		message:
			'Password must contain at least 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character',
	})
	newPassword: string;
}
