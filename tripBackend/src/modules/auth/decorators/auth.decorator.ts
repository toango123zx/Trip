import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthGuard } from '../guards';

export const Auth = (): MethodDecorator & ClassDecorator & PropertyDecorator =>
	applyDecorators(UseGuards(AuthGuard), ApiBearerAuth());
