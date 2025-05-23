import { api, EServer } from '@/lib';
import {
	TDiscount,
	TDiscountDetail,
	TDiscountsNonDiscountable,
	TPagination,
} from '@/types';

import {
	TRequestBodyAssignProductSchedulesToDiscount,
	TRequestBodyCreateDiscount,
	TRequestBodyDeleteProductSchedulesToDiscount,
	TRequestQueryGetDiscountsByProductId,
	TRequestQueryGetNonDiscountableSchedules,
	TResponseBodyAsignProductSchedulesToDiscount,
} from './discount.type';

export const discountApi = {
	async getDiscountsByProductId(
		productId: string,
		query?: TRequestQueryGetDiscountsByProductId,
	): Promise<[TDiscountDetail[], TPagination?]> {
		const response = await api.get<TDiscountDetail[]>(
			`/discount/${productId}`,
			query,
			EServer.Backend,
		);
		return [response.data, response.pagination];
	},

	async getDiscountByUserId(
		query?: TRequestQueryGetDiscountsByProductId,
	): Promise<[TDiscountDetail[], TPagination?]> {
		const response = await api.get<TDiscountDetail[]>(
			`/discount/`,
			query,
			EServer.Backend,
		);
		return [response.data, response.pagination];
	},

	async getNonDiscountableSchedules(
		discountId: string,
		productId: string,
		query?: TRequestQueryGetNonDiscountableSchedules,
	): Promise<[TDiscountsNonDiscountable[], TPagination?]> {
		const response = await api.get<TDiscountsNonDiscountable[]>(
			`discount/${discountId}/${productId}/nonDiscountableSchedules`,
			query,
			EServer.Backend,
		);
		return [response.data, response.pagination];
	},

	async getDiscountByDiscountId(discountId: string): Promise<TDiscount> {
		const response = await api.get<TDiscount>(
			`/discount/${discountId}`,
			{},
			EServer.Backend,
		);
		return response.data;
	},

	async createDiscount(discount: TRequestBodyCreateDiscount): Promise<TDiscount> {
		const response = await api.post<TDiscount, TRequestBodyCreateDiscount>(
			`/discount`,
			discount,
			{},
			EServer.Backend,
		);
		return response;
	},

	async asignProductSchedulesToDiscount(
		discountId: string,
		schedules: TRequestBodyAssignProductSchedulesToDiscount,
	): Promise<TResponseBodyAsignProductSchedulesToDiscount> {
		const response = await api.post<
			TResponseBodyAsignProductSchedulesToDiscount,
			TRequestBodyAssignProductSchedulesToDiscount
		>(`/discount/${discountId}/assign-schedules`, schedules, {}, EServer.Backend);
		return response;
	},

	async deleteProductSchedulesToDiscount(
		discountId: string,
		schedules: TRequestBodyDeleteProductSchedulesToDiscount,
	): Promise<TDiscount> {
		const response = await api.delete<
			TDiscount,
			TRequestBodyDeleteProductSchedulesToDiscount
		>(`/discount/${discountId}/delete-schedules`, schedules, {}, EServer.Backend);
		return response;
	},

	async deleteDiscount(discountId: string): Promise<TDiscount> {
		const response = await api.delete<TDiscount>(
			`/discount/${discountId}`,
			undefined,
			{},
			EServer.Backend,
		);
		return response;
	},
};
