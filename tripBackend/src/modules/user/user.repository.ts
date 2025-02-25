import { Injectable } from '@nestjs/common';

import { IPaginationQuery } from 'src/common';
import { UpdateUserDto, UserEntity } from 'src/models';

import { PrismaService } from '../database/services';

import { UserOrderByDto } from './dtos';

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

	async findUsers(
		pagination: IPaginationQuery,
		filter?: UserOrderByDto,
	): Promise<[UserEntity[], number]> {
		const [users, totalRecords] = await Promise.all([
			this.prismaService.user.findMany({
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
				skip: pagination.skip,
				take: pagination.take,
				orderBy: filter,
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

	async updateUserByUserId(userId: string, user: UpdateUserDto): Promise<UserEntity> {
		return this.prismaService.user.update({
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
				id: userId,
				status: 'active',
			},
			data: user,
		});
	}
}
