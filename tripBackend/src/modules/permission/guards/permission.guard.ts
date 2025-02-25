import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ForbiddenException } from 'src/common';
import { PERMISSION_KEY } from 'src/common/constants/permission.constant';
import { PermissionEnum } from 'src/common/enums';
import { UserInformationDto } from 'src/modules/user/dtos';

@Injectable()
export class PermissionGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const user = context.switchToHttp().getRequest().user as UserInformationDto;
		const requiredPermission = this.reflector.getAllAndOverride<PermissionEnum[]>(
			PERMISSION_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!requiredPermission) {
			return true;
		}

		if (!user.permission) {
			throw new ForbiddenException();
		}

		const userPermission = user.permission.map(
			(permission) => permission.name as PermissionEnum,
		);

		const access = requiredPermission.every((permission) =>
			userPermission.includes(permission),
		);
		if (!access) {
			throw new ForbiddenException();
		}
		return true;
	}
}
