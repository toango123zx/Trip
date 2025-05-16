import { createAsyncThunk } from '@reduxjs/toolkit';

import { TDiscountApplicationScopeSumary, TPagination } from '@/types';

import { TRequestQueryGetDiscountApplicationScopes } from './discountApplicationScope.type';
import { discountApplicationScopeApi } from './discountApplicationScopeApi';

const getDiscountApplicationScopes = createAsyncThunk(
	'discount-application-scope/get-discount-application-scopes',
	async ({
		query = {},
	}: {
		query?: TRequestQueryGetDiscountApplicationScopes;
	}): Promise<[TDiscountApplicationScopeSumary[], TPagination?]> => {
		const [data, pagination] =
			await discountApplicationScopeApi.getDiscountApplicationScopes(query);
		return [data, pagination];
	},
);

export const discountApplicationScopeThunk = {
	getDiscountApplicationScopes,
};
