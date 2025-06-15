import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

import { UserStatusEnum } from '@prisma/client';
import { Socket } from 'socket.io';
import { IJwtPayload, UnauthorizedException } from 'src/common';
import { jwtConfig } from 'src/configs';
import { SupplierEntity } from 'src/models';
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
		let accessToken: string | undefined;
		let user: UserInformationDto;
		let supplier: SupplierEntity;
		let request;

		switch (context.getType()) {
			case 'ws': {
				const client = context.switchToWs().getClient<Socket>();
				const cookies = client.handshake.headers.cookie.split(';').reduce(
					(cookies, cookie) => {
						const [name, value] = cookie.trim().split('=');
						if (name && value) {
							cookies[name] = decodeURIComponent(value);
						}
						return cookies;
					},
					{} as Record<string, string>,
				);
				accessToken = cookies.accessToken;
				client.data.acctoken = accessToken;
				request = client.data;
				break;
			}
			case 'http': {
				request = context.switchToHttp().getRequest<Response>();
				accessToken = request.cookies.accessToken;
				break;
			}
		}

		if (!accessToken) {
			throw new UnauthorizedException();
		}

		try {
			const payload: IJwtPayload = this.jwtService.verify(accessToken, {
				secret: jwtConfig.secret,
			});
			user = new UserInformationDto(
				await this.userRepository.findUserByUserId(
					payload.userId,
					UserStatusEnum.active,
				),
			);

			user.permission = user.role.infoPermission.map(
				(infoPermission) => infoPermission.permission,
			);
			delete user.role.infoPermission;

			supplier = await this.supplierRepository.findSupplierFeeByUserId(
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
