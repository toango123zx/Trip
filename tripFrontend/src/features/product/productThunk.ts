import { createAsyncThunk } from '@reduxjs/toolkit';

import { TPagination, TProductDetail, TProductSumary } from '@/types';

import { TRequestQueryGetProducts } from './product.type';
import { productApi } from './productApi';

const getProducts = createAsyncThunk(
	'product/getProducts',
	async (
		query?: TRequestQueryGetProducts,
	): Promise<[TProductSumary[], TPagination?]> => {
		const [data, pagination] = await productApi.getProducts(query);
		return [data, pagination];
	},
);

const getProductDetail = createAsyncThunk(
	'product/getProductDetail',
	async (productId: string): Promise<TProductDetail> => {
		const data = await productApi.getProductDetail(productId);
		return data;
	},
);

export const productThunk = {
	getProducts,
	getProductDetail,
};
