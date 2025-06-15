import { Injectable } from '@nestjs/common';

import { CreateMessageDto, MessageEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class MessageRepository {
	constructor(private prisma: PrismaService) {}

	async createMessage(message: CreateMessageDto): Promise<MessageEntity> {
		return this.prisma.message.create({
			include: {
				user: {
					include: {
						role: true,
					},
				},
			},
			data: {
				boxChat: {
					connect: {
						id: message.boxChat.connect.id,
					},
				},
				content: message.content,
				user: {
					connect: {
						id: message.user.connect.id,
					},
				},
			},
		});
	}
}
