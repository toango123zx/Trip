import { Injectable } from '@nestjs/common';

import { IPaginationQuery } from 'src/common';
import { BoxChatEntity, CreateBoxChatDto } from 'src/models';

import { PrismaService } from '../database/services';

import { BoxChatOrderByDto } from './dtos';

@Injectable()
export class BoxChatRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findBoxChatsByBoxChatIdAndBoxChatMembers(
		boxChatId: string,
		userIds: string[],
		nameSearch?: string,
		pagination: IPaginationQuery = {} as IPaginationQuery,
		filter?: BoxChatOrderByDto,
	): Promise<[BoxChatEntity[], number]> {
		const orderBy = Object.entries(filter || {})
			.filter(([_, value]) => Boolean(value))
			.map(([key, value]) => ({ [key]: value }));
		const [boxChats, totalRecords] = await Promise.all([
			this.prismaService.boxChat.findMany({
				include: {
					boxChatMember: {
						include: {
							user: {
								include: {
									role: true,
								},
							},
						},
					},
					message: true,
				},
				where: {
					id: boxChatId,
					name: nameSearch,
					boxChatMember: {
						some: {
							userId: {
								in: userIds,
							},
						},
					},
				},
				take: pagination.take,
				skip: pagination.skip,
				orderBy: orderBy,
			}),
			this.prismaService.boxChat.count({
				where: {
					id: boxChatId,
					boxChatMember: {
						some: {
							userId: {
								in: userIds,
							},
						},
					},
				},
			}),
		]);
		return [boxChats, totalRecords];
	}

	async findBoxChatsByBoxChatIdAndExactBoxChatMembers(
		boxChatId: string,
		userIds: string[],
		nameSearch?: string,
		pagination: IPaginationQuery = {} as IPaginationQuery,
		filter?: BoxChatOrderByDto,
	): Promise<[BoxChatEntity[], number]> {
		const orderBy = Object.entries(filter || {})
			.filter(([_, value]) => Boolean(value))
			.map(([key, value]) => ({ [key]: value }));
		const [boxChats, totalRecords] = await Promise.all([
			this.prismaService.boxChat.findMany({
				include: {
					boxChatMember: {
						include: {
							user: {
								include: {
									role: true,
								},
							},
						},
					},
					message: true,
				},
				where: {
					id: boxChatId,
					name: nameSearch,
					boxChatMember: {
						none: {
							userId: {
								notIn: userIds,
							},
						},
					},
				},
				take: pagination.take,
				skip: pagination.skip,
				orderBy: orderBy,
			}),
			this.prismaService.boxChat.count({
				where: {
					id: boxChatId,
					boxChatMember: {
						none: {
							userId: {
								notIn: userIds,
							},
						},
					},
				},
			}),
		]);
		return [boxChats, totalRecords];
	}

	async createBoxChat(
		boxChat: CreateBoxChatDto,
		boxChatMember: string[],
	): Promise<BoxChatEntity> {
		return this.prismaService.boxChat.create({
			include: {
				boxChatMember: {
					include: {
						user: {
							include: {
								role: true,
							},
						},
					},
				},
			},
			data: {
				name: boxChat.name,
				boxChatMember: {
					create: boxChatMember.map((userId) => ({
						user: {
							connect: { id: userId },
						},
					})),
				},
			},
		});
	}
}
