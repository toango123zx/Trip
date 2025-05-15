import { api, EServer } from '@/lib';
import { TDiscountTypeSumary, TPagination } from '@/types';

import { TRequestQueryGetDiscountTypes } from './discountType.type';

export const discountTypeApi = {
	async getDiscountTypes(
		query?: TRequestQueryGetDiscountTypes,
	): Promise<[TDiscountTypeSumary[], TPagination?]> {
		const response = await api.get<TDiscountTypeSumary[]>(
			`/discount-type`,
			query,
			EServer.Backend,
		);
		return [response.data, response.pagination];
	},
};
