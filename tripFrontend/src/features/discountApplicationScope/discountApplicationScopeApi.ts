import { api, EServer } from '@/lib';
import { TDiscountApplicationScopeSumary, TPagination } from '@/types';

import { TRequestQueryGetDiscountApplicationScopes } from './discountApplicationScope.type';

export const discountApplicationScopeApi = {
	async getDiscountApplicationScopes(
		query?: TRequestQueryGetDiscountApplicationScopes,
	): Promise<[TDiscountApplicationScopeSumary[], TPagination?]> {
		const response = await api.get<TDiscountApplicationScopeSumary[]>(
			`/discount-application-scope`,
			query,
			EServer.Backend,
		);
		return [response.data, response.pagination];
	},
};
