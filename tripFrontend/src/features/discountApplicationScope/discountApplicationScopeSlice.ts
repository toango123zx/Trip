import { createSlice } from '@reduxjs/toolkit';

import { TPagination } from '@/types';

import { TDiscountApplicationScopeState } from './discountApplicationScope.type';
import { discountApplicationScopeThunk } from './discountApplicationScopeThunk';

const initialState: TDiscountApplicationScopeState = {
	discountApplicationScopes: [],
	pagination: {} as TPagination,
	loading: false,
	error: null,
};

export const discountApplicationScopeSlice = createSlice({
	name: 'discountApplicationScope',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(
				discountApplicationScopeThunk.getDiscountApplicationScopes.pending,
				(state) => {
					state.loading = true;
					state.error = null;
				},
			)
			.addCase(
				discountApplicationScopeThunk.getDiscountApplicationScopes.fulfilled,
				(state, action) => {
					state.loading = false;
					state.discountApplicationScopes = action.payload[0];
					state.pagination = action.payload[1] || ({} as TPagination);
				},
			)
			.addCase(
				discountApplicationScopeThunk.getDiscountApplicationScopes.rejected,
				(state, action) => {
					state.loading = false;
					state.error = String(action.error.message);
				},
			);
	},
});
