import { Injectable } from '@nestjs/common';

import { UserEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class UserRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async getUserByEmail(email: string): Promise<UserEntity> {
		try {
			return this.prismaService.user.findFirst({
				where: {
					email: email,
				},
			});
		} catch (error) {
			return error;
		}
	}
}
