import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsArray, IsString, IsNotEmpty } from 'class-validator';
import { AutoTrim } from 'src/common/decorators';

export class CreateBoxChatRequestDto {
	@ApiProperty({
		type: String,
		required: false,
	})
	@IsNotEmpty()
	@Type(() => String)
	@IsString()
	@AutoTrim()
	name: string;

	@ApiProperty({
		type: String,
		isArray: true,
		required: false,
	})
	@IsNotEmpty()
	@IsArray()
	@Type(() => String)
	@IsString({ each: true })
	@AutoTrim()
	boxChatMember: string[];
}
