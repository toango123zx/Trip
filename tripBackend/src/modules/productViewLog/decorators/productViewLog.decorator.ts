import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { OptionalAuthGuard } from 'src/modules/auth/guards';

import { ProductViewLogInterceptor } from '../interceptors/productViewLog.interceptor';

export function ProductViewLog(): MethodDecorator & ClassDecorator {
	return applyDecorators(
		UseGuards(OptionalAuthGuard),
		UseInterceptors(ProductViewLogInterceptor),
		ApiBearerAuth(),
	);
}
