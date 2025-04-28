import { createSlice } from '@reduxjs/toolkit';

import { TUser } from '@/types';

import { TUserState } from './user.type';
import { userThunk } from './userThunk';

const initialState: TUserState = {
	users: [],
	userDetail: {} as TUser,
	loading: false,
	error: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(userThunk.getMe.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(userThunk.getMe.fulfilled, (state, action) => {
				state.loading = false;
				state.userDetail = action.payload;
			})
			.addCase(userThunk.getMe.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(userThunk.getUsers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(userThunk.getUsers.fulfilled, (state, action) => {
				state.loading = false;
				state.users = action.payload;
			})
			.addCase(userThunk.getUsers.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			});
	},
});
