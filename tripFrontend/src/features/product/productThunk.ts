import { createAsyncThunk } from '@reduxjs/toolkit';

import { TProductSumary } from '@/types';

import { TRequestQueryGetProducts } from './product.type';
import { productApi } from './productApi';

const getProducts = createAsyncThunk(
	'product/getProducts',
	async (query?: TRequestQueryGetProducts): Promise<TProductSumary[]> => {
		const data = await productApi.getProducts(query);
		return data;
	},
);

export const productThunk = {
	getProducts,
};
