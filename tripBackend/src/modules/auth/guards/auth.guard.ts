import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

import { IJwtPayload, UnauthorizedException } from 'src/common';
import { jwtConfig } from 'src/configs';
import { UserInformationDto } from 'src/modules/user/dtos';

import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userRepository: UserRepository,
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const [type, accessToken] = request.headers.authorization?.split(' ') ?? [];

		if (type !== 'Bearer' || !accessToken) {
			throw new UnauthorizedException();
		}
		try {
			const payload: IJwtPayload = this.jwtService.verify(accessToken, {
				secret: jwtConfig.secret,
			});
			const user: UserInformationDto = new UserInformationDto(
				await this.userRepository.findUserById(payload.userId),
			);

			user.permission = user.role.infoPermission.map(
				(infoPermission) => infoPermission.permission,
			);
			delete user.role.infoPermission;

			request.user = user;
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new UnauthorizedException(error.message);
			}
			throw error;
		}

		return true;
	}
}
