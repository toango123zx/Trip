import { createAsyncThunk } from '@reduxjs/toolkit';

import { TDiscountDetail, TPagination } from '@/types';

import { TRequestQueryGetDiscountsByProductId } from './discount.type';
import { discountApi } from './discountApi';

const getDiscountsByProductId = createAsyncThunk(
	'discount/getDiscountsByProductId',
	async ({
		productId,
		query,
	}: {
		productId: string;
		query?: TRequestQueryGetDiscountsByProductId;
	}): Promise<[TDiscountDetail[], TPagination?]> => {
		const [data, pagination] = await discountApi.getDiscountsByProductId(
			productId,
			query,
		);
		return [data, pagination];
	},
);

export const discoutnThunk = {
	getDiscountsByProductId,
};
