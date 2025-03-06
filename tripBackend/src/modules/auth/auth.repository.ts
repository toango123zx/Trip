import { Injectable } from '@nestjs/common';

import { accountExternalStatusEnum, accountStatusEnum } from '@prisma/client';
import {
	AccountEntity,
	AccountExternalDto,
	CreateAccountDto,
	UpdateAccountDto,
} from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class AuthRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findAccountByUsername(username: string): Promise<AccountEntity> {
		try {
			return this.prismaService.account.findFirst({
				include: {
					user: {
						include: {
							role: true,
						},
					},
				},
				where: {
					username: username,
					status: 'active',
					user: {
						status: 'active',
						role: {
							status: 'active',
						},
					},
				},
			});
		} catch (error) {
			return error;
		}
	}

	async findAccountByUserId(
		userId: string,
		accountStatus?: accountStatusEnum,
	): Promise<AccountEntity> {
		return this.prismaService.account.findFirst({
			include: {
				user: true,
			},
			where: {
				userId: userId,
				status: accountStatus,
			},
		});
	}

	async findAccountExternalByUserId(
		userId: string,
		accountExternalStatus?: accountExternalStatusEnum,
	): Promise<AccountExternalDto> {
		return this.prismaService.accountExternal.findFirst({
			where: {
				userId: userId,
				status: accountExternalStatus,
			},
		});
	}

	async createAccount(account: CreateAccountDto): Promise<AccountEntity> {
		try {
			return this.prismaService.account.create({
				include: {
					user: {
						include: {
							role: {
								include: {
									infoPermission: {
										include: {
											permission: true,
										},
									},
								},
							},
						},
					},
				},
				data: account,
			});
		} catch (error) {
			return error;
		}
	}

	async updateAccountByAccountId(
		accountId: string,
		account: UpdateAccountDto,
	): Promise<AccountEntity> {
		try {
			return this.prismaService.account.update({
				include: {
					user: true,
				},
				where: {
					id: accountId,
					status: 'active',
				},
				data: account,
			});
		} catch (error) {
			return error;
		}
	}

	async updateAccountStatusByUserId(
		userId: string,
		accountStatus: accountStatusEnum,
	): Promise<AccountEntity> {
		return this.prismaService.account.update({
			include: {
				user: true,
			},
			where: {
				userId: userId,
				status: {
					not: accountStatus,
				},
			},
			data: {
				status: accountStatus,
			},
		});
	}
}
