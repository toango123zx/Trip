import { createAsyncThunk } from '@reduxjs/toolkit';

import { TDiscountTypeSumary, TPagination } from '@/types';

import { TRequestQueryGetDiscountTypes } from './discountType.type';
import { discountTypeApi } from './discountTypeApi';

const getDiscountTypes = createAsyncThunk(
	'discount-type/get-discount-types',
	async ({
		query = {},
	}: {
		query?: TRequestQueryGetDiscountTypes;
	}): Promise<[TDiscountTypeSumary[], TPagination?]> => {
		const [data, pagination] = await discountTypeApi.getDiscountTypes(query);
		return [data, pagination];
	},
);

export const discountTypeThunk = {
	getDiscountTypes,
};
