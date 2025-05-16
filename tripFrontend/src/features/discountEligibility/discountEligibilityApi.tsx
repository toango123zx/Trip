import { api, EServer } from '@/lib';
import { TDiscountEligibilitySumary, TPagination } from '@/types';

import { TRequestQueryGetDiscountEligibilities } from './discountEligibility.type';

export const discountEligibilityApi = {
	async getDiscountEligibilities(
		query?: TRequestQueryGetDiscountEligibilities,
	): Promise<[TDiscountEligibilitySumary[], TPagination?]> {
		const response = await api.get<TDiscountEligibilitySumary[]>(
			`/discount-eligibility`,
			query,
			EServer.Backend,
		);
		return [response.data, response.pagination];
	},
};
