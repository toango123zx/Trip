import { createAsyncThunk } from '@reduxjs/toolkit';

import { TPagination, TProductDetail, TProductSumary } from '@/types';

import {
	TRequestBodyCreateProduct,
	TRequestBodyUpdateProduct,
	TRequestQueryGetProducts,
} from './product.type';
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

const createProduct = createAsyncThunk(
	'product/createProduct',
	async (product: TRequestBodyCreateProduct) => {
		const data = await productApi.createProduct(product);
		return data;
	},
);

const updateProductByProductId = createAsyncThunk(
	'product/updateProductByProductId',
	async ({
		productId,
		product,
	}: {
		productId: string;
		product: TRequestBodyUpdateProduct;
	}) => {
		const data = await productApi.updateProductByProductId(productId, product);
		return data;
	},
);

export const productThunk = {
	getProducts,
	getProductDetail,
	createProduct,
	updateProductByProductId,
};
