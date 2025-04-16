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

export type TRequestBodyRegisterApi = {
	username: string;
	password: string;
	email: string;
	name: string;
	confirmPassword: string;
};

export type TDataRegister = {
	id: string;
	username: string;
	userId: string;
	createAt: string;
	updateAt: string;
	deletedAt: string | null;
	status: 'active' | 'inactive' | 'banned';
	name: string;
};
