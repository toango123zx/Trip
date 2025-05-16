import { createSlice } from '@reduxjs/toolkit';

import { TDiscount, TPagination } from '@/types';

import { TDiscountState } from './discount.type';
import { discountThunk } from './discountThunk';

const initialState: TDiscountState = {
	discounts: [],
	discountDetail: {} as TDiscount,
	discountsNonDiscountable: [],
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
			.addCase(discountThunk.getDiscountsByProductId.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(discountThunk.getDiscountsByProductId.fulfilled, (state, action) => {
				state.loading = false;
				state.discounts = action.payload[0];
				state.pagination = action.payload[1] || ({} as TPagination);
				state.error = null;
			})
			.addCase(discountThunk.getDiscountsByProductId.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(discountThunk.getDiscountByUserId.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(discountThunk.getDiscountByUserId.fulfilled, (state, action) => {
				state.loading = false;
				state.discounts = action.payload[0];
				state.pagination = action.payload[1] || ({} as TPagination);
				state.error = null;
			})
			.addCase(discountThunk.getDiscountByUserId.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(discountThunk.getNonDiscountableSchedules.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				discountThunk.getNonDiscountableSchedules.fulfilled,
				(state, action) => {
					state.loading = false;
					state.discountsNonDiscountable = action.payload[0];
					state.pagination = action.payload[1] || ({} as TPagination);
					state.error = null;
				},
			)
			.addCase(
				discountThunk.getNonDiscountableSchedules.rejected,
				(state, action) => {
					state.loading = false;
					state.error = String(action.error.message);
				},
			)
			.addCase(discountThunk.getDiscountByDiscountId.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(discountThunk.getDiscountByDiscountId.fulfilled, (state, action) => {
				state.loading = false;
				state.discountDetail = action.payload;
				state.error = null;
			})
			.addCase(discountThunk.getDiscountByDiscountId.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(discountThunk.createDiscount.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(discountThunk.createDiscount.fulfilled, (state, action) => {
				state.loading = false;
				state.discountDetail = action.payload;
				state.error = null;
			})
			.addCase(discountThunk.createDiscount.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(discountThunk.assignProductSchedulesToDiscount.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				discountThunk.assignProductSchedulesToDiscount.fulfilled,
				(state) => {
					state.loading = false;
					state.error = null;
				},
			)
			.addCase(
				discountThunk.assignProductSchedulesToDiscount.rejected,
				(state, action) => {
					state.loading = false;
					state.error = String(action.error.message);
				},
			)
			.addCase(discountThunk.deleteProductSchedulesToDiscount.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				discountThunk.deleteProductSchedulesToDiscount.fulfilled,
				(state, action) => {
					state.loading = false;
					state.discountDetail = action.payload;
					state.error = null;
				},
			)
			.addCase(
				discountThunk.deleteProductSchedulesToDiscount.rejected,
				(state, action) => {
					state.loading = false;
					state.error = String(action.error.message);
				},
			)
			.addCase(discountThunk.deleteDiscount.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(discountThunk.deleteDiscount.fulfilled, (state, action) => {
				state.loading = false;
				state.discountDetail = action.payload;
				state.error = null;
			})
			.addCase(discountThunk.deleteDiscount.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			});
	},
});
