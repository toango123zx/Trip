import {
	EArrange,
	EDiscountStatus,
	EInfoDiscountStatus,
	TDiscount,
	TDiscountDetail,
	TDiscountsNonDiscountable,
	TPagination,
} from '@/types';

export type TDiscountState = {
	discounts: TDiscountDetail[];
	discountDetail: TDiscount;
	discountsNonDiscountable: TDiscountsNonDiscountable[];
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
	statusSearch?: EDiscountStatus;
	status?: EDiscountStatus;
};

export type TRequestQueryGetNonDiscountableSchedules = {
	page?: number;
	limit?: number;
	startTimeSearch?: Date;
	endTimeSearch?: Date;
	startTime?: EArrange;
	endTime?: EArrange;
	price?: EArrange;
	booked?: EArrange;
	productScheduleId?: EArrange;
	startOrder?: EArrange;
	endOrder?: EArrange;
	createAt?: EArrange;
	updateAt?: EArrange;
	deletedAt?: EArrange;
	status?: EArrange;
};

export type TRequestBodyCreateDiscount = {
	name: string;
	description: string;
	startTime: Date;
	endTime: Date;
	value: number;
	quantity: number;
	point: number;
	discountTypeId: string;
	discountEligibilityId: string;
	discountApplicationScopeId: string;
	scheduleIds?: string[];
	productId?: string;
};

export type TAddScheduleInDiscount = {
	productId: string;
	productName: string;
	schedulesId: string;
	startTime: Date;
	endTime: Date;
	booked: number;
	price: number;
	status: EInfoDiscountStatus;
};

export type TRequestBodyAssignProductSchedulesToDiscount = {
	scheduleIds: string[];
};

export type TRequestBodyDeleteProductSchedulesToDiscount = {
	scheduleIds: string[];
};

export type TResponseBodyAsignProductSchedulesToDiscount = {
	id: string;
	discountId: string;
	productScheduleId: string;
	createAt: string;
	updateAt: string;
	deletedAt: string | null;
	status: EInfoDiscountStatus;
};
