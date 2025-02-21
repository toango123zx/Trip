import { Injectable } from '@nestjs/common';

import { AccountEntity, CreateAccountDto } from 'src/models';

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
}
