import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { PERMISSION_KEY, PermissionEnum } from 'src/common';
import { PermissionGuard } from 'src/modules/permission/guards';

import { AuthGuard } from '../guards';

export const AuthPermission = (
	...permisson: PermissionEnum[]
): MethodDecorator & ClassDecorator & PropertyDecorator =>
	applyDecorators(
		SetMetadata(PERMISSION_KEY, permisson),
		UseGuards(AuthGuard, PermissionGuard),
		ApiBearerAuth(),
	);
