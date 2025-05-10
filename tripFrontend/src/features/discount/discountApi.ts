import { api, EServer } from '@/lib';
import { TDiscountDetail, TPagination } from '@/types';

import { TRequestQueryGetDiscountsByProductId } from './discount.type';

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
};
