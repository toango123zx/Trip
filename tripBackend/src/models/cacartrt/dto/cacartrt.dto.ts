import { ApiProperty } from '@nestjs/swagger';

export class CacartrtDto {
	@ApiProperty({
		type: 'string',
	})
	id: string;
}
