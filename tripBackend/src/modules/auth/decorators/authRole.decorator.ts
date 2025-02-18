import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ROLE_KEY } from 'src/common';
import { RoleEnum } from 'src/common/enums';
import { RoleGuard } from 'src/modules/role/guards';

import { AuthGuard } from '../guards';

export const AuthRole = (
	roles: RoleEnum,
): MethodDecorator & ClassDecorator & PropertyDecorator =>
	applyDecorators(
		SetMetadata(ROLE_KEY, roles),
		UseGuards(AuthGuard, RoleGuard),
		ApiBearerAuth(),
	);
