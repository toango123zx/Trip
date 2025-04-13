import { TAccount } from '@/types';

export type TAuthState = {
	account: TAccount[];
	loading: boolean;
	error: string | null;
};

export type TRequestBodyLoginApi = {
	username: string;
	password: string;
};

export type TDataLogin = {
	accessToken: string;
};
