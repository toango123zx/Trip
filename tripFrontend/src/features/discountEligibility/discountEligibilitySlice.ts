import { createSlice } from '@reduxjs/toolkit';

import { TPagination } from '@/types';

import { TDiscountEligibilityState } from './discountEligibility.type';
import { discountEligibilityThunk } from './discountEligibilityThunk';

const initialState: TDiscountEligibilityState = {
	discountEligibilities: [],
	pagination: {} as TPagination,
	loading: false,
	error: null,
};

export const discountEligibilitySlice = createSlice({
	name: 'discountEligibility',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(
				discountEligibilityThunk.getDiscountEligibilities.pending,
				(state) => {
					state.loading = true;
					state.error = null;
				},
			)
			.addCase(
				discountEligibilityThunk.getDiscountEligibilities.fulfilled,
				(state, action) => {
					state.loading = false;
					state.discountEligibilities = action.payload[0];
					state.pagination = action.payload[1] || ({} as TPagination);
				},
			)
			.addCase(
				discountEligibilityThunk.getDiscountEligibilities.rejected,
				(state, action) => {
					state.loading = false;
					state.error = String(action.error.message);
				},
			);
	},
});
