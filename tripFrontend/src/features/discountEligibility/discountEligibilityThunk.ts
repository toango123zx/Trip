import { createAsyncThunk } from '@reduxjs/toolkit';

import { TDiscountEligibilitySumary, TPagination } from '@/types';

import { TRequestQueryGetDiscountEligibilities } from './discountEligibility.type';
import { discountEligibilityApi } from './discountEligibilityApi';

const getDiscountEligibilities = createAsyncThunk(
	'discount-eligibility-/get-discount-eligibilities',
	async ({
		query = {},
	}: {
		query?: TRequestQueryGetDiscountEligibilities;
	}): Promise<[TDiscountEligibilitySumary[], TPagination?]> => {
		const [data, pagination] =
			await discountEligibilityApi.getDiscountEligibilities(query);
		return [data, pagination];
	},
);

export const discountEligibilityThunk = {
	getDiscountEligibilities,
};
