import { EArrange, TPagination, TUser } from '@/types';

export enum ERoleName {
	admin = 'admin',
	supplier = 'supplier',
	tourist = 'tourist',
}

export type TUserState = {
	users: TUser[];
	userDetail: TUser;
	pagination: TPagination;
	loading: boolean;
	error: string | null;
};

export type TRequestQueryGetUsers = {
	page?: number;
	limit?: number;
	name?: EArrange;
	roleName?: EArrange;
	gender?: EArrange;
	email?: EArrange;
	createAt?: EArrange;
	status?: EArrange;
};
