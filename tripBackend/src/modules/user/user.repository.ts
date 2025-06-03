import { Injectable } from '@nestjs/common';

import {
	BillStatusEnum,
	Prisma,
	ProductScheduleStatusEnum,
	UserStatusEnum,
} from '@prisma/client';
import { IPaginationQuery } from 'src/common';
import {
	AccountEntity,
	AccountExternalEntity,
	UpdateUserDto,
	UserEntity,
} from 'src/models';

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

	async findUsersByUserIds(
		userIds: string[],
		userStatus?: UserStatusEnum[],
		pagination: IPaginationQuery = {} as IPaginationQuery,
		filter?: UserOrderByDto,
	): Promise<[UserEntity[], number]> {
		const orderBy = filter
			? Object.entries(filter)
					.filter(([_, value]) => value)
					.map(([key, value]) => ({ [key]: value }))
			: [];
		const [users, totalRecords] = await Promise.all([
			this.prismaService.user.findMany({
				include: {
					role: true,
				},
				where: {
					id: {
						in: userIds,
					},
					status: {
						in: userStatus,
					},
				},
				orderBy: orderBy,
				skip: pagination.skip,
				take: pagination.take,
			}),
			this.prismaService.user.count({
				where: {
					id: {
						in: userIds,
					},
					status: {
						in: userStatus,
					},
				},
			}),
		]);
		return [users, totalRecords];
	}

	async findUsersInProductSchedulebyProductScheduleId(
		productScheduleId: string,
		productScheduleStatus?: ProductScheduleStatusEnum[],
		billStatus?: BillStatusEnum[],
		userStatus?: UserStatusEnum[],
		pagination: IPaginationQuery = {} as IPaginationQuery,
		filter?: UserOrderByDto,
	): Promise<[UserEntity[], number]> {
		const orderBy = filter
			? Object.entries(filter)
					.filter(([_, value]) => value)
					.map(([key, value]) => ({ [key]: value }))
			: [];
		const [users, totalRecords] = await Promise.all([
			this.prismaService.user.findMany({
				include: {
					bill: {
						include: {
							infoBill: {
								where: {
									productScheduleId: productScheduleId,
								},
							},
						},
					},
				},
				where: {
					status: {
						in: userStatus,
					},
					bill: {
						some: {
							infoBill: {
								some: {
									productSchedule: {
										id: productScheduleId,
										status: {
											in: productScheduleStatus,
										},
									},
								},
							},
							status: {
								in: billStatus,
							},
						},
					},
				},
				take: pagination.take,
				skip: pagination.skip,
				orderBy: orderBy,
			}),
			this.prismaService.user.count({
				where: {
					status: {
						in: userStatus,
					},
					bill: {
						some: {
							infoBill: {
								some: {
									productSchedule: {
										id: productScheduleId,
										status: {
											in: productScheduleStatus,
										},
									},
								},
							},
							status: {
								in: billStatus,
							},
						},
					},
				},
			}),
		]);
		return [users, totalRecords];
	}

	async findUserByUserId(
		userId: string,
		userStatus?: UserStatusEnum,
	): Promise<UserEntity> {
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
				id: userId,
				status: userStatus,
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

	async lockUserByUserId(
		userId: string,
		account?: boolean,
		accountExternal?: boolean,
	): Promise<[UserEntity, AccountEntity?, AccountExternalEntity?]> {
		const transactions: Prisma.PrismaPromise<
			UserEntity | AccountEntity | AccountExternalEntity
		>[] = [
			this.prismaService.user.update({
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
				data: {
					status: 'locked',
				},
			}),
		];

		if (account) {
			transactions.push(
				this.prismaService.account.update({
					where: {
						userId: userId,
						status: 'active',
					},
					data: {
						status: 'locked',
					},
				}),
			);
		}

		if (accountExternal) {
			transactions.push(
				this.prismaService.accountExternal.update({
					where: {
						userId: userId,
						status: 'active',
					},
					data: {
						status: 'locked',
					},
				}),
			);
		}

		return this.prismaService.$transaction(transactions) as Promise<
			[UserEntity, AccountEntity?, AccountExternalEntity?]
		>;
	}

	async unlockUserByUserId(
		userId: string,
		account?: boolean,
		accountExternal?: boolean,
	): Promise<[UserEntity, AccountEntity?, AccountExternalEntity?]> {
		const transactions: Prisma.PrismaPromise<
			UserEntity | AccountEntity | AccountExternalEntity
		>[] = [
			this.prismaService.user.update({
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
					status: 'locked',
				},
				data: {
					status: 'active',
				},
			}),
		];

		if (account) {
			transactions.push(
				this.prismaService.account.update({
					where: {
						userId: userId,
						status: 'locked',
					},
					data: {
						status: 'active',
					},
				}),
			);
		}

		if (accountExternal) {
			transactions.push(
				this.prismaService.accountExternal.update({
					where: {
						userId: userId,
						status: 'locked',
					},
					data: {
						status: 'active',
					},
				}),
			);
		}

		return this.prismaService.$transaction(transactions) as Promise<
			[UserEntity, AccountEntity?, AccountExternalEntity?]
		>;
	}
}
