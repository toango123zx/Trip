import { EArrange, EDiscountStatus, TDiscountDetail, TPagination } from '@/types';

export type TDiscountState = {
	discounts: TDiscountDetail[];
	pagination: TPagination;
	loading: boolean;
	error: string | null;
};

export type TRequestQueryGetDiscountsByProductId = {
	page?: number;
	limit?: number;
	keyword?: string;
	name?: EArrange;
	code?: EArrange;
	startTime?: EArrange;
	endTime?: EArrange;
	quantity?: EArrange;
	value?: EArrange;
	applited?: EArrange;
	stackable?: EArrange;
	createAt?: EArrange;
	updateAt?: EArrange;
	deletedAt?: EArrange;
	status?: EDiscountStatus;
};
