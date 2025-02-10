import { Injectable } from '@nestjs/common';

import { UserEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class UserRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findUserByEmail(email: string): Promise<UserEntity> {
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

	async findUsers(): Promise<UserEntity[]> {
		try {
			return this.prismaService.user.findMany();
		} catch (error) {
			return error;
		}
	}

	async findUserById(id: string): Promise<UserEntity> {
		try {
			return this.prismaService.user.findFirst({
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
				where: {
					id: id,
					status: 'active',
					role: {
						status: 'active',
						infoPermission: {
							every: {
								permission: {
									status: 'active',
								},
							},
						},
					},
				},
			});
		} catch (error) {
			return error;
		}
	}
}
