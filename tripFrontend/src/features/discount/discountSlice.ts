import { createSlice } from '@reduxjs/toolkit';

import { TDiscountDetail, TPagination } from '@/types';

import { TDiscountState } from './discount.type';
import { discoutnThunk } from './discountThunk';

const initialState: TDiscountState = {
	discounts: [],
	discountDetail: {} as TDiscountDetail,
	pagination: {} as TPagination,
	loading: false,
	error: null,
};

export const discountSlice = createSlice({
	name: 'discount',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(discoutnThunk.getDiscountsByProductId.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(discoutnThunk.getDiscountsByProductId.fulfilled, (state, action) => {
				state.loading = false;
				state.discounts = action.payload[0];
				state.pagination = action.payload[1] || ({} as TPagination);
				state.error = null;
			})
			.addCase(discoutnThunk.getDiscountsByProductId.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(discoutnThunk.createDiscount.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(discoutnThunk.createDiscount.fulfilled, (state, action) => {
				state.loading = false;
				state.discountDetail = action.payload;
				state.error = null;
			})
			.addCase(discoutnThunk.createDiscount.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			});
	},
});
