import { createSlice } from '@reduxjs/toolkit';

import { TPagination } from '@/types';

import { TDiscountState } from './discount.type';
import { discoutnThunk } from './discountThunk';

const initialState: TDiscountState = {
	discounts: [],
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
			})
			.addCase(discoutnThunk.getDiscountsByProductId.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			});
	},
});
