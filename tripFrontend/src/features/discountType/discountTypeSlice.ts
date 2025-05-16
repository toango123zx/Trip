import { createSlice } from '@reduxjs/toolkit';

import { TPagination } from '@/types';

import { TDiscountTypeState } from './discountType.type';
import { discountTypeThunk } from './discountTypeThunk';

const initialState: TDiscountTypeState = {
	discountTypes: [],
	pagination: {} as TPagination,
	loading: false,
	error: null,
};

export const discountTypeSlice = createSlice({
	name: 'discountType',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(discountTypeThunk.getDiscountTypes.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(discountTypeThunk.getDiscountTypes.fulfilled, (state, action) => {
				state.loading = false;
				state.discountTypes = action.payload[0];
				state.pagination = action.payload[1] || ({} as TPagination);
			})
			.addCase(discountTypeThunk.getDiscountTypes.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			});
	},
});

export default discountTypeSlice.reducer;
