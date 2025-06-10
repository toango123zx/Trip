import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { OptionalAuthGuard } from '../guards';

export const OptionalAuth = (): MethodDecorator & ClassDecorator & PropertyDecorator =>
	applyDecorators(UseGuards(OptionalAuthGuard), ApiBearerAuth());
