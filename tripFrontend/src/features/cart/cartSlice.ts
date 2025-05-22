import { createSlice } from '@reduxjs/toolkit';

import { TCartSummary, TPagination } from '@/types';

import { TCartState } from './cart.type';
import { cartThunk } from './cartThunk';
import { scheduleThunk } from '../schedule';

const initialState: TCartState = {
	carts: [],
	cartDetail: {} as TCartSummary,
	pagination: {} as TPagination,
	loading: false,
	error: null,
};

export const cartSlice = createSlice({
	name: 'cart',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(cartThunk.getCarts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(cartThunk.getCarts.fulfilled, (state, action) => {
				state.loading = false;
				state.carts = action.payload[0];
				state.pagination = action.payload[1] || ({} as TPagination);
				state.error = null;
			})
			.addCase(cartThunk.getCarts.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(cartThunk.deleteCartByCartId.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(cartThunk.deleteCartByCartId.fulfilled, (state, action) => {
				state.loading = false;
				state.cartDetail = action.payload;
				state.error = null;
			})
			.addCase(cartThunk.deleteCartByCartId.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			})
			.addCase(scheduleThunk.addScheduleToCart.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(scheduleThunk.addScheduleToCart.fulfilled, (state, action) => {
				state.loading = false;
				state.cartDetail = action.payload;
				state.error = null;
			})
			.addCase(scheduleThunk.addScheduleToCart.rejected, (state, action) => {
				state.loading = false;
				state.error = String(action.error.message);
			});
	},
});
