import { createSlice } from '@reduxjs/toolkit';

import { TProductDetail } from '@/types';

import { TProductState } from './product.type';
import { productThunk } from './productThunk';

const initialState: TProductState = {
	products: [],
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
				state.products = action.payload;
			})
			.addCase(productThunk.getProducts.rejected, (state, action) => {
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
			});
	},
});
