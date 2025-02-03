import { Injectable } from '@nestjs/common';

import { AccountEntity, CreateAccountDto } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class AuthRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findAccountByEmail(username: string): Promise<AccountEntity> {
		try {
			return this.prismaService.account.findFirst({
				where: {
					username: username,
				},
			});
		} catch (error) {
			return error;
		}
	}

	async createAccount(account: CreateAccountDto): Promise<AccountEntity> {
		try {
			return this.prismaService.account.create({
				data: account,
			});
		} catch (error) {
			return error;
		}
	}
}
