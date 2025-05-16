import {
	EArrange,
	EDiscountApplicationScopeStatus,
	TDiscountApplicationScopeSumary,
	TPagination,
} from '@/types';

export type TDiscountApplicationScopeState = {
	discountApplicationScopes: TDiscountApplicationScopeSumary[];
	pagination: TPagination;
	loading: boolean;
	error: string | null;
};

export type TRequestQueryGetDiscountApplicationScopes = {
	page?: number;
	limit?: number;
	keyword?: string;
	name?: EArrange;
	createAt?: EArrange;
	updateAt?: EArrange;
	deletedAt?: EArrange;
	status?: EDiscountApplicationScopeStatus;
};
