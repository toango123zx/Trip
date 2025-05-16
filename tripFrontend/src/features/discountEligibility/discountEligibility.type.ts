import {
	EArrange,
	EDiscountEligibilityStatus,
	TDiscountEligibilitySumary,
	TPagination,
} from '@/types';

export type TDiscountEligibilityState = {
	discountEligibilities: TDiscountEligibilitySumary[];
	pagination: TPagination;
	loading: boolean;
	error: string | null;
};

export type TRequestQueryGetDiscountEligibilities = {
	page?: number;
	limit?: number;
	keyword?: string;
	name?: EArrange;
	createAt?: EArrange;
	updateAt?: EArrange;
	deletedAt?: EArrange;
	status?: EDiscountEligibilityStatus;
};
