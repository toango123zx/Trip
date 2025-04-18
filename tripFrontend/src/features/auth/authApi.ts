import { api } from '@/lib';

import {
	TDataLogin,
	TDataRegister,
	TRequestBodyLoginApi,
	TRequestBodyRegisterApi,
} from './authType';

export const authApi = {
	async login(loginInfromation: TRequestBodyLoginApi): Promise<TDataLogin> {
		const data = await api.post<TDataLogin, TRequestBodyLoginApi>(
			'/auth/login',
			loginInfromation,
		);
		return data;
	},

	async register(registerInformation: TRequestBodyRegisterApi): Promise<TDataRegister> {
		const data = await api.post<TDataRegister, TRequestBodyRegisterApi>(
			'/auth/register',
			registerInformation,
		);
		return data;
	},
};
