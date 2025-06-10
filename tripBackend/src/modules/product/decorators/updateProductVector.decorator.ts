import { applyDecorators, UseInterceptors } from '@nestjs/common';

import { UpdateProductVectorInterceptor } from '../interceptors';

export function UpdateProductVector(): MethodDecorator & ClassDecorator {
	return applyDecorators(UseInterceptors(UpdateProductVectorInterceptor));
}
