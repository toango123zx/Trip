import { Injectable } from '@nestjs/common';

import { BoxChatEntity, CreateBoxChatDto } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class BoxChatRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findBoxChat(
		boxChatId: string,
		userId: string[],
	): Promise<[BoxChatEntity[], number]> {
		const [boxChat, totalRecords] = await Promise.all([
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
					boxChatMember: {
						none: {
							userId: {
								notIn: userId,
							},
						},
					},
				},
			}),
			this.prismaService.boxChat.count({
				where: {
					id: boxChatId,
					boxChatMember: {
						none: {
							userId: {
								notIn: userId,
							},
						},
					},
				},
			}),
		]);
		return [boxChat, totalRecords];
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
