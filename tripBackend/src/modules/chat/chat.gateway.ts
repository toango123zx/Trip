import { JwtService } from '@nestjs/jwt';
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
	MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { BoxChatEntity } from 'src/models';

import { Auth } from '../auth/decorators';
import { BoxChatRepository } from '../boxChat/boxChat.repository';
import { GetBoxChatDetailResponseDto } from '../boxChat/dtos';
import { GetMessageResponseDto } from '../message/dtos';
import { MessageRepository } from '../message/message.repositroy';

@WebSocketGateway({
	cors: {
		origin: '*',
		credentials: true,
	},
})
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;

	private connectedUsers: Map<string, string> = new Map();

	constructor(
		private readonly jwtService: JwtService,
		private readonly boxChat: BoxChatRepository,
		private readonly messageService: MessageRepository,
	) {}

	afterInit(): void {}

	async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
		if (!client.handshake.headers.cookie.includes('accessToken')) {
			client.emit('error', { message: 'Unauthorized' });
			return;
		}

		const cookies = client.handshake.headers.cookie.split(';').reduce(
			(cookies, cookie) => {
				const [name, value] = cookie.trim().split('=');
				if (name && value) {
					cookies[name] = decodeURIComponent(value);
				}
				return cookies;
			},
			{} as Record<string, string>,
		);
		const accessToken = cookies.accessToken;
		const userId: string = this.jwtService.decode(accessToken)?.userId;
		if (!userId) {
			client.disconnect(true);
			return;
		}
		this.connectedUsers.set(client.id, userId);
		client.emit('connected', { success: true });
	}

	async handleDisconnect(client: Socket): Promise<void> {
		this.connectedUsers.delete(client.id);
	}

	@Auth()
	@SubscribeMessage('joinBoxChat')
	async onJoinChat(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { userId: string },
	): Promise<void> {
		try {
			const myInformationId = this.connectedUsers.get(client.id);
			if (!myInformationId) {
				client.emit('error', { message: 'Unauthorized' });
				return;
			}
			const { userId } = data;

			const [boxChatExists, totalRecordsBoxChat] =
				await this.boxChat.findBoxChatsByBoxChatIdAndExactBoxChatMembers(
					undefined,
					[myInformationId, userId],
				);
			let boxChat: BoxChatEntity;
			let flag = false;

			if (totalRecordsBoxChat > 0) {
				const foundChat = boxChatExists.find(
					(chat) =>
						chat.boxChatMember.length === 2 &&
						chat.boxChatMember.every((member) =>
							[myInformationId, userId].includes(member.userId),
						),
				);
				if (foundChat) {
					boxChat = await this.boxChat.findBoxChatByBoxChatId(
						foundChat.id,
						myInformationId,
					);
					flag = true;
				}
			}

			if (!flag) {
				boxChat = await this.boxChat.createBoxChat(
					{
						name: `Chat between ${myInformationId} and ${userId}`,
					},
					[myInformationId, userId],
				);
			}
			client.join(boxChat.id);
			client.emit('chatHistory', {
				data: new GetBoxChatDetailResponseDto(boxChat),
			});
		} catch {
			client.disconnect(true);
		}
	}

	@SubscribeMessage('leaveBoxChat')
	async onLeaveChat(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { boxChatId: string },
	): Promise<void> {
		const myInformationId = this.connectedUsers.get(client.id);
		if (!myInformationId) {
			client.emit('error', { message: 'Unauthorized' });
			return;
		}

		if (!client.rooms.has(data.boxChatId)) {
			client.emit('error', { message: 'boxChatId does not exist' });
			return;
		}

		client.leave(data.boxChatId);
		client.emit('leftChat', { boxChatId: data.boxChatId });
	}

	@SubscribeMessage('sendMessage')
	async onSendMessage(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { boxChatId: string; content: string },
	): Promise<void> {
		const myInformationId = this.connectedUsers.get(client.id);
		if (!myInformationId) {
			client.emit('error', { message: 'Unauthorized' });
			return;
		}

		if (!client.rooms.has(data.boxChatId)) {
			client.emit('error', { message: 'boxChatId does not exist' });
			return;
		}

		try {
			const userMsg = await this.messageService.createMessage({
				boxChat: {
					connect: {
						id: data.boxChatId,
					},
				},
				content: data.content,
				user: {
					connect: {
						id: myInformationId,
					},
				},
			});

			client.to(data.boxChatId).emit('newMessage', {
				boxChatId: data.boxChatId,
				message: new GetMessageResponseDto(userMsg),
			});

			const isBot = false;
			if (!isBot) {
				client.emit('newMessage', {
					boxChatId: data.boxChatId,
					message: new GetMessageResponseDto(userMsg),
				});
			}
		} catch (err) {
			client.emit('error', { message: err.message || 'Cannot send message' });
		}
	}
}
