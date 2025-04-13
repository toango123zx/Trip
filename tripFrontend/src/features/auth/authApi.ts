import { api } from '@/lib';

import { TDataLogin, TRequestBodyLoginApi } from './authType';

export const LoginApi = async (
	username: string,
	password: string,
): Promise<TDataLogin> => {
	const data = await api.post<TRequestBodyLoginApi, TDataLogin>('/auth/login', {
		username: username,
		password: password,
	});
	return data;
};
