import { EArrange, EDiscountTypeStatus, TDiscountTypeSumary, TPagination } from '@/types';

export type TDiscountTypeState = {
	discountTypes: TDiscountTypeSumary[];
	pagination: TPagination;
	loading: boolean;
	error: string | null;
};

export type TRequestQueryGetDiscountTypes = {
	page?: number;
	limit?: number;
	keyword?: string;
	name?: EArrange;
	createAt?: EArrange;
	updateAt?: EArrange;
	deletedAt?: EArrange;
	status?: EDiscountTypeStatus;
};
