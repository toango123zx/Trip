import { createAsyncThunk } from '@reduxjs/toolkit';

import { TBoxChat, TBoxChatSummary, TPagination } from '@/types';
import { boxChatApi } from './boxChatApi';
import { TRequestQueryGetBoxChats } from './boxChat.type';


const getBoxChats = createAsyncThunk(
	'boxChat/getBoxChats',
	async (
		query?: TRequestQueryGetBoxChats,
	): Promise<[TBoxChatSummary[], TPagination?]> => {
		const [data, pagination] = await boxChatApi.getBoxChats(query);
		return [data, pagination];
	},
);


const getBoxChatByBoxChatId = createAsyncThunk(
	'boxChat/getBoxChatByBoxChatId',
	async (boxChatId: string): Promise<TBoxChat> => {
		const data = await boxChatApi.getBoxChatByBoxChatId(boxChatId);
		return data;
	},
);

export const boxChatThunk = {
	getBoxChats,
	getBoxChatByBoxChatId,
};
