import { Injectable } from '@nestjs/common';

import { IPaginationQuery } from 'src/common';
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

	async findUsers(pagination: IPaginationQuery): Promise<[UserEntity[], number]> {
		const [users, totalRecords] = await Promise.all([
			this.prismaService.user.findMany({
				skip: pagination.skip,
				take: pagination.take,
			}),
			this.prismaService.user.count(),
		]);
		return [users, totalRecords];
	}

	async findUserById(id: string): Promise<UserEntity> {
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
	}
}
