import { ApiProperty } from '@nestjs/swagger';

import { HttpResponseBodyDto } from './httpResponseBody.dto';

export class HttpResponseBodyFailDto<T = undefined> extends HttpResponseBodyDto<T> {
	@ApiProperty({
		required: true,
		nullable: false,
		type: Boolean,
	})
	success: boolean = false;
}
