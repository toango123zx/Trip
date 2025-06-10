import { createSlice } from '@reduxjs/toolkit';

import { TBoxChat, TPagination } from '@/types';
import { TBoxChatState } from './boxChat.type';
import { boxChatThunk } from './boxChatThunk';


const initialState: TBoxChatState = {
	boxChats: [],
	boxChatDetail: {} as TBoxChat,
	pagination: {} as TPagination,
	loading: false,
	error: null,
};

export const boxChatSlice = createSlice({
	name: 'boxChat',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(boxChatThunk.getBoxChats.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(boxChatThunk.getBoxChats.fulfilled, (state, action) => {
				state.loading = false;
				state.boxChats = action.payload[0];
				state.pagination = action.payload[1] || ({} as TPagination);
				state.error = null;
			})
			.addCase(boxChatThunk.getBoxChats.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(boxChatThunk.getBoxChatByBoxChatId.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(boxChatThunk.getBoxChatByBoxChatId.fulfilled, (state, action) => {
				state.loading = false;
				state.boxChatDetails = action.payload;
				state.error = null;
			})
			.addCase(boxChatThunk.getBoxChatByBoxChatId.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			});
	},
});
