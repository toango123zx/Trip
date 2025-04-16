import { api } from '@/lib';

import {
	TDataLogin,
	TDataRegister,
	TRequestBodyLoginApi,
	TRequestBodyRegisterApi,
} from './authType';

export const authApi = {
	async login(loginInfromation: TRequestBodyLoginApi): Promise<TDataLogin> {
		const data = await api.post<TRequestBodyLoginApi, TDataLogin>(
			'/auth/login',
			loginInfromation,
		);
		return data;
	},

	async register(registerInformation: TRequestBodyRegisterApi): Promise<TDataRegister> {
		const data = await api.post<TRequestBodyRegisterApi, TDataRegister>(
			'/auth/register',
			registerInformation,
		);
		return data;
	},
};
