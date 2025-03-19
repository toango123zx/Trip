import { ApiProperty } from '@nestjs/swagger';

export class BoxChatDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
	@ApiProperty({
		type: 'string',
	})
	name: string;
}
