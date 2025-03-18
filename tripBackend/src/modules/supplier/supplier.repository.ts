import { Injectable } from '@nestjs/common';

import { UserStatusEnum } from '@prisma/client';
import { supplierInformationConfig } from 'src/configs/supplierInformation.config';
import { SupplierEntity, UpdateUserDto, UserEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class SupplierRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findSupplierByUserId(
		userId: string,
		userStatus?: UserStatusEnum,
	): Promise<UserEntity> {
		return this.prismaService.user.findFirst({
			include: {
				supplier: true,
				role: true,
			},
			where: {
				id: userId,
				status: userStatus,
				NOT: {
					supplier: null,
				},
			},
		});
	}

	async findSupplierFeeByUserId(
		userId: string,
		userStatus: UserStatusEnum,
	): Promise<SupplierEntity> {
		return this.prismaService.supplier.findFirst({
			where: {
				user: {
					id: userId,
					status: userStatus,
				},
			},
		});
	}

	async createSupplierByUserId(
		userId: string,
		userInformation: UpdateUserDto,
		taxId: string,
	): Promise<UserEntity> {
		return this.prismaService.user.update({
			include: {
				supplier: true,
				role: true,
			},
			where: {
				id: userId,
			},
			data: {
				...userInformation,
				supplier: {
					create: {
						taxId: taxId,
						fee: supplierInformationConfig.fee,
					},
				},
			},
		});
	}
}
