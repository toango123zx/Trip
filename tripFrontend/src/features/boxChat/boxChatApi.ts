import { api, EServer } from '@/lib';
import { TPagination, TBoxChatSummary, TBoxChat } from '@/types';
import { TRequestQueryCreateBoxChat, TRequestQueryGetBoxChats } from './boxChat.type';


export const boxChatApi = {
	async getBoxChats(query?: TRequestQueryGetBoxChats,): Promise<[TBoxChatSummary[], TPagination?]> {
		const response = await api.get<TBoxChatSummary[]>(
			'/box-chat',
			query,
			EServer.Backend,
		);

		return [response.data, response.pagination];
	},

	async getBoxChatByBoxChatId(boxChatId: string): Promise<TBoxChat> {
			const response = await api.get<TBoxChat>(
				`/box-chat/${boxChatId}`,
				{},
				EServer.Backend,
			);
			return response.data;
		},

	async createBoxChat(boxChat: TRequestQueryCreateBoxChat): Promise<TBoxChat> {
		const response = await api.post<TBoxChat>(
			'/box-chat',
			boxChat,
			undefined,
			EServer.Backend,
		);
		return response;
	}
};
