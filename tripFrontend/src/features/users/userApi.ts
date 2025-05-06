import { api, EServer } from '@/lib';
import { TPagination, TUser } from '@/types';

import { TRequestQueryGetUsers } from './user.type';

export const userApi = {
	async getMe(): Promise<TUser> {
		const response = await api.get<TUser>('/user/me', {}, EServer.Backend);
		return response.data;
	},

	async getUsers(query?: TRequestQueryGetUsers): Promise<[TUser[], TPagination?]> {
		const response = await api.get<TUser[]>('/user', query, EServer.Backend);
		return [response.data, response.pagination];
	},
};
