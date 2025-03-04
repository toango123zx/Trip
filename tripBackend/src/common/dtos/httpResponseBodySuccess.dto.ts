import { ApiProperty } from '@nestjs/swagger';

import { HttpResponseBodyDto } from './httpResponseBody.dto';

export class HttpResponseBodySuccessDto<T = undefined> extends HttpResponseBodyDto<T> {
	@ApiProperty({
		required: true,
		nullable: false,
		type: Boolean,
	})
	success: boolean = true;
	@ApiProperty({
		required: true,
		nullable: false,
		type: Object,
	})
	data: T;
}
