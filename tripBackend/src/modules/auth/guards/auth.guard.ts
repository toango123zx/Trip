import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

import { UserStatusEnum } from '@prisma/client';
import { IJwtPayload, UnauthorizedException } from 'src/common';
import { jwtConfig } from 'src/configs';
import { UserInformationDto } from 'src/modules/user/dtos';

import { SupplierRepository } from 'src/modules/supplier/supplier.repository';
import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userRepository: UserRepository,
		private readonly supplierRepository: SupplierRepository,
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const accessToken = request.cookies.accessToken;
		if (!accessToken) {
			throw new UnauthorizedException();
		}

		try {
			const payload: IJwtPayload = this.jwtService.verify(accessToken, {
				secret: jwtConfig.secret,
			});
			const user: UserInformationDto = new UserInformationDto(
				await this.userRepository.findUserByUserId(
					payload.userId,
					UserStatusEnum.active,
				),
			);

			user.permission = user.role.infoPermission.map(
				(infoPermission) => infoPermission.permission,
			);
			delete user.role.infoPermission;

			const supplier = await this.supplierRepository.findSupplierFeeByUserId(
				user.id,
				UserStatusEnum.active,
			);

			request.user = user;
			if (supplier) {
				request.supplier = {
					id: supplier.id,
					fee: supplier.fee,
					taxId: supplier.taxId,
				};
			}
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new UnauthorizedException(error.message);
			}
			throw error;
		}

		return true;
	}
}
