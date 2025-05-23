import { createAsyncThunk } from '@reduxjs/toolkit';
import { notificationUtils } from '@/utils/notificationUtils';

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
		try {
			const [data, pagination] = await productApi.getProducts(query);
			return [data, pagination];
		} catch (error) {
			console.error('Lỗi trong productThunk getProducts:', error);
			throw error;
		}
	},
);

const getProductsManagement = createAsyncThunk(
	'product/getProductsManagement',
	async (
		query?: TRequestQueryGetProducts,
	): Promise<[TProductSumary[], TPagination?]> => {
		const [data, pagination] = await productApi.getProductsManagement(query);
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
	async (product: TRequestBodyCreateProduct, { rejectWithValue }) => {
		try {
			const data = await productApi.createProduct(product);
			
			// Sử dụng notification tạo sản phẩm thành công
			notificationUtils.success();

			return data;
		} catch (error) {
			// Sử dụng notification lỗi tạo sản phẩm
			notificationUtils.error()

			return rejectWithValue(error);
		}
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
	}, { rejectWithValue }) => {
		try {
			const data = await productApi.updateProductByProductId(productId, product);
			
			// Sử dụng notification cụ thể cho product
			notificationUtils.success();

			return data;
		} catch (error) {
			// Sử dụng notification lỗi cho product
			notificationUtils.error();

			return rejectWithValue(error);
		}
	},
);

const deleteProductByProductId = createAsyncThunk(
	'product/deleteProductByProductId',
	async (productId: string) => {
		const data = await productApi.deleteProductByProductId(productId);
		return data;
	},
);

export const productThunk = {
	getProducts,
	getProductsManagement,
	getProductDetail,
	createProduct,
	updateProductByProductId,
	deleteProductByProductId,
};
