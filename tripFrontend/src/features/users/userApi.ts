import { api, EServer } from '@/lib';
import { TUser } from '@/types';

import { TRequestQueryGetUsers } from './user.type';

export const userApi = {
	async getMe(): Promise<TUser> {
		const data = await api.get<TUser>('/user/me', {}, EServer.Backend);
		return data;
	},

	async getUsers(query?: TRequestQueryGetUsers): Promise<TUser[]> {
		const data = await api.get<TUser[]>('/user', query, EServer.Backend);
		return data;
	},
};
