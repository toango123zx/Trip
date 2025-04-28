import { createAsyncThunk } from '@reduxjs/toolkit';

import { TUser } from '@/types';

import { TRequestQueryGetUsers } from './user.type';
import { userApi } from './userApi';

const getMe = createAsyncThunk('users/getMe', async (): Promise<TUser> => {
	const data = await userApi.getMe();
	return data;
});

const getUsers = createAsyncThunk(
	'users/getUsers',
	async (query?: TRequestQueryGetUsers): Promise<TUser[]> => {
		const data = await userApi.getUsers(query);
		return data;
	},
);

export const userThunk = {
	getMe,
	getUsers,
};
