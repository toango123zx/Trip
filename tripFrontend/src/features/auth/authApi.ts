import { api } from '@/lib';

import { TDataLogin, TRequestBodyLoginApi } from './authType';

export const AuthApi = {
	login: async (username: string, password: string): Promise<TDataLogin> => {
		try {
			const res = await api.post<TRequestBodyLoginApi, TDataLogin>('/auth/login', {
				username,
				password,
			});
			return res;
		} catch (err: any) {
			throw new Error(err?.response?.data?.message || 'Login failed');
		}
	},
	// register: async ...,
	// logout: async ...,
};
