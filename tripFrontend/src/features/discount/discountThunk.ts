import { createAsyncThunk } from '@reduxjs/toolkit';

import { TDiscountDetail, TPagination } from '@/types';

import {
	TRequestBodyCreateDiscount,
	TRequestQueryGetDiscountsByProductId,
} from './discount.type';
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

const createDiscount = createAsyncThunk(
	'discount/createDiscount',
	async ({
		discount,
	}: {
		discount: TRequestBodyCreateDiscount;
	}): Promise<TDiscountDetail> => {
		const response = await discountApi.creatDiscount(discount);
		return response;
	},
);

export const discoutnThunk = {
	getDiscountsByProductId,
	createDiscount,
};
