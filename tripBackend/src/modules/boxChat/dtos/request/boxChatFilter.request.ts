import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';
import { OrderByEnum } from 'src/common';

export class BoxChatFilterRequestDto {
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	nameSearch?: string;

	@ApiProperty({
		type: 'string',
		enum: OrderByEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	name?: OrderByEnum;
}
