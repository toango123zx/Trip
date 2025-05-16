import { createSlice } from '@reduxjs/toolkit';

import { TPagination, TProductDetail } from '@/types';

import { TProductState } from './product.type';
import { productThunk } from './productThunk';

const initialState: TProductState = {
	products: [],
	pagination: {} as TPagination,
	productDetail: {} as TProductDetail,
	loading: false,
	error: null,
};

export const productSlice = createSlice({
	name: 'product',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(productThunk.getProducts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(productThunk.getProducts.fulfilled, (state, action) => {
				state.loading = false;
				state.products = action.payload[0];
				state.pagination = action.payload[1] || ({} as TPagination);
			})
			.addCase(productThunk.getProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(productThunk.getProductsManagement.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(productThunk.getProductsManagement.fulfilled, (state, action) => {
				state.loading = false;
				state.products = action.payload[0];
				state.pagination = action.payload[1] || ({} as TPagination);
			})
			.addCase(productThunk.getProductsManagement.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(productThunk.getProductDetail.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(productThunk.getProductDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.productDetail = action.payload;
			})
			.addCase(productThunk.getProductDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(productThunk.createProduct.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(productThunk.createProduct.fulfilled, (state, action) => {
				state.loading = false;
				state.productDetail = action.payload;
				state.error = null;
			})
			.addCase(productThunk.createProduct.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(productThunk.updateProductByProductId.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(productThunk.updateProductByProductId.fulfilled, (state, action) => {
				state.loading = false;
				state.productDetail = action.payload;
				state.error = null;
			})
			.addCase(productThunk.updateProductByProductId.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(productThunk.deleteProductByProductId.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(productThunk.deleteProductByProductId.fulfilled, (state, action) => {
				state.loading = false;
				state.productDetail = action.payload;
				state.error = null;
			})
			.addCase(productThunk.deleteProductByProductId.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			});
	},
});
