import { ApiProperty } from '@nestjs/swagger';

export class HttpResponseBodySuccessDto<T> {
	@ApiProperty({
		required: true,
		nullable: false,
		type: Object,
	})
	data: T;
	@ApiProperty({
		required: false,
		nullable: true,
		type: Number,
	})
	totalPage?: number;
}
