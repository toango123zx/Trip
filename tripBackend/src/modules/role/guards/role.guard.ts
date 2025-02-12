import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ForbiddenException, ROLE_KEY } from 'src/common';
import { RoleEnum } from 'src/common/enums';
import { UserInformationDto } from 'src/modules/user/dtos';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const user = context.switchToHttp().getRequest().user as UserInformationDto;
		const requiredRole = this.reflector.getAllAndOverride<RoleEnum>(ROLE_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredRole) {
			return true;
		}

		if (requiredRole !== user.role.name) {
			throw new ForbiddenException();
		}
		return true;
	}
}
